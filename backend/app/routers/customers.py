"""Customer Module API routes."""

from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import text

from app.config import settings
from app.db.pool import build_engine


router = APIRouter(
    prefix="/customers",
    tags=["customers"],
)


engine = build_engine(
    settings.database_url,
    settings.app_name,
)


# ============================================================
# Request Models
# ============================================================

class CustomerLoginRequest(BaseModel):
    email: str
    phone: str


class CustomerRegisterRequest(BaseModel):
    name: str
    email: str
    phone: str


class CustomerOTPRequest(BaseModel):
    email: str
    phone: str
    otp: str


class CustomerProfileRequest(BaseModel):
    customer_id: int
    name: str
    email: str
    phone: str


class CustomerAddressRequest(BaseModel):
    customer_id: int
    address_line1: str
    address_line2: str = ""
    city: str
    state: str
    pincode: str
    latitude: float | None = None
    longitude: float | None = None
    address_type: str


class CustomerAddressUpdateRequest(BaseModel):
    customer_id: int
    address_id: int
    address_line1: str
    address_line2: str = ""
    city: str
    state: str
    pincode: str
    latitude: float | None = None
    longitude: float | None = None
    address_type: str


class CustomerAddressIdRequest(BaseModel):
    customer_id: int
    address_id: int


class DefaultAddressRequest(BaseModel):
    customer_id: int
    address_id: int


class RestaurantLocationRequest(BaseModel):
    city: str


class RestaurantIdRequest(BaseModel):
    restaurant_id: str


class CartItemRequest(BaseModel):
    menu_id: str
    quantity: int
    unit_price: float


class CartRequest(BaseModel):
    customer_id: int
    restaurant_id: str
    items: list[CartItemRequest]


class CartItemUpdateRequest(BaseModel):
    customer_id: int
    menu_id: str
    quantity: int


class CheckoutRequest(BaseModel):
    customer_id: int
    restaurant_id: str
    address_id: int
    offer_code: str | None = None


# ============================================================
# Helper Functions
# ============================================================

def format_address(
    address_line1: str,
    address_line2: str,
    city: str,
    state: str,
    pincode: str,
) -> str:
    parts = [
        address_line1,
        address_line2,
        city,
        state,
        pincode,
    ]

    return ", ".join(
        part.strip()
        for part in parts
        if part and part.strip()
    )


def address_response(row):
    return {
        "address_id": row["address_id"],
        "customer_id": row["customer_id"],
        "address_text": row["address_text"],
        "latitude": (
            float(row["latitude"])
            if row["latitude"] is not None
            else None
        ),
        "longitude": (
            float(row["longitude"])
            if row["longitude"] is not None
            else None
        ),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "franchisee_id": (
            str(row["franchisee_id"])
            if row["franchisee_id"] is not None
            else None
        ),
    }


# ============================================================
# Test API
# ============================================================

@router.get("/test")
def test_customer_api():
    """Verify Customer Module API routing."""

    return {
        "status": "ok",
        "module": "customer",
    }


# ============================================================
# Login
# ============================================================

@router.post("/login")
def customer_login(request: CustomerLoginRequest):
    """
    Check whether the customer exists by email and phone.

    Actual OTP authentication is not implemented here because
    the approved authentication service has not been connected.
    """

    with engine.connect() as connection:

        row = connection.execute(
            text(
                """
                SELECT
                    c.customer_id,
                    c.user_id,
                    c.name,
                    c.mobile,
                    c.email,
                    c.default_address_id,
                    c.loyalty_points
                FROM vgf_customers c
                WHERE LOWER(c.email) = LOWER(:email)
                  AND c.mobile = :phone
                  AND c.is_deleted = FALSE
                  AND c.is_active = TRUE
                LIMIT 1
                """
            ),
            {
                "email": request.email,
                "phone": request.phone,
            },
        ).mappings().first()

    if row is None:
        return {
            "status": "not_found",
            "message": (
                "Customer not found. "
                "Registration or OTP validation is required."
            ),
        }

    return {
        "status": "ok",
        "message": "Customer found.",
        "customer": jsonable_encoder(dict(row)),
    }


# ============================================================
# Registration
# ============================================================

@router.post("/register")
def customer_register(request: CustomerRegisterRequest):
    """
    Validate registration details.

    Customer creation is not performed here until the approved
    authentication/registration flow is confirmed.
    """

    with engine.connect() as connection:

        existing_customer = connection.execute(
            text(
                """
                SELECT
                    customer_id,
                    user_id,
                    name,
                    email,
                    mobile
                FROM vgf_customers
                WHERE (
                    LOWER(email) = LOWER(:email)
                    OR mobile = :phone
                )
                AND is_deleted = FALSE
                LIMIT 1
                """
            ),
            {
                "email": request.email,
                "phone": request.phone,
            },
        ).mappings().first()

    if existing_customer is not None:
        return {
            "status": "exists",
            "message": (
                "A customer already exists with the supplied "
                "email or phone."
            ),
            "customer": jsonable_encoder(dict(existing_customer)),
        }

    return {
        "status": "ready_for_verification",
        "message": (
            "Customer details are valid and ready for "
            "OTP/validation."
        ),
        "name": request.name,
        "email": request.email,
        "phone": request.phone,
    }


# ============================================================
# OTP Verification
# ============================================================

@router.post("/verify-otp")
def verify_customer_otp(request: CustomerOTPRequest):
    """
    OTP verification placeholder.

    Actual OTP validation must use the approved authentication
    service. No OTP value is hardcoded.
    """

    return {
        "status": "pending",
        "message": (
            "OTP verification requires the approved "
            "authentication service."
        ),
        "email": request.email,
        "phone": request.phone,
    }


# ============================================================
# Customer Profile
# ============================================================

@router.post("/profile")
def customer_profile(request: CustomerProfileRequest):
    """Update an existing customer profile."""

    with engine.begin() as connection:

        result = connection.execute(
            text(
                """
                UPDATE vgf_customers
                SET
                    name = :name,
                    email = :email,
                    mobile = :phone,
                    updated_at = NOW()
                WHERE customer_id = :customer_id
                  AND is_deleted = FALSE
                RETURNING
                    customer_id,
                    user_id,
                    name,
                    mobile,
                    email,
                    default_address_id,
                    loyalty_points,
                    created_at,
                    updated_at,
                    franchisee_id
                """
            ),
            {
                "customer_id": request.customer_id,
                "name": request.name,
                "email": request.email,
                "phone": request.phone,
            },
        )

        row = result.mappings().first()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found.",
        )

    return {
        "status": "ok",
        "message": "Customer profile updated successfully.",
        "customer": jsonable_encoder(dict(row)),
    }


# ============================================================
# Customer Address - Add
# ============================================================

@router.post("/address")
def add_customer_address(request: CustomerAddressRequest):
    """Add an address for an existing customer."""

    address_text = format_address(
        request.address_line1,
        request.address_line2,
        request.city,
        request.state,
        request.pincode,
    )

    with engine.begin() as connection:

        customer_exists = connection.execute(
            text(
                """
                SELECT customer_id
                FROM vgf_customers
                WHERE customer_id = :customer_id
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                """
            ),
            {
                "customer_id": request.customer_id,
            },
        ).scalar()

        if customer_exists is None:
            raise HTTPException(
                status_code=404,
                detail="Customer not found.",
            )

        row = connection.execute(
            text(
                """
                INSERT INTO vgf_customer_addresses (
                    customer_id,
                    address_text,
                    latitude,
                    longitude,
                    created_at,
                    updated_at,
                    is_active,
                    is_deleted
                )
                VALUES (
                    :customer_id,
                    :address_text,
                    :latitude,
                    :longitude,
                    NOW(),
                    NOW(),
                    TRUE,
                    FALSE
                )
                RETURNING
                    address_id,
                    customer_id,
                    address_text,
                    latitude,
                    longitude,
                    created_at,
                    updated_at,
                    franchisee_id
                """
            ),
            {
                "customer_id": request.customer_id,
                "address_text": address_text,
                "latitude": request.latitude,
                "longitude": request.longitude,
            },
        ).mappings().first()

    return {
        "status": "ok",
        "message": "Customer address added successfully.",
        "address": address_response(row),
    }


# ============================================================
# Customer Address - View
# ============================================================

@router.post("/address/view")
def view_customer_address(
    request: CustomerAddressIdRequest,
):
    """View one address belonging to a customer."""

    with engine.connect() as connection:

        row = connection.execute(
            text(
                """
                SELECT
                    address_id,
                    customer_id,
                    address_text,
                    latitude,
                    longitude,
                    created_at,
                    updated_at,
                    franchisee_id
                FROM vgf_customer_addresses
                WHERE address_id = :address_id
                  AND customer_id = :customer_id
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                """
            ),
            {
                "address_id": request.address_id,
                "customer_id": request.customer_id,
            },
        ).mappings().first()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Address not found for this customer.",
        )

    return {
        "status": "ok",
        "address": address_response(row),
    }


# ============================================================
# Customer Address - Update
# ============================================================

@router.put("/address")
def update_customer_address(
    request: CustomerAddressUpdateRequest,
):
    """Update an existing customer address."""

    address_text = format_address(
        request.address_line1,
        request.address_line2,
        request.city,
        request.state,
        request.pincode,
    )

    with engine.begin() as connection:

        result = connection.execute(
            text(
                """
                UPDATE vgf_customer_addresses
                SET
                    address_text = :address_text,
                    latitude = :latitude,
                    longitude = :longitude,
                    updated_at = NOW()
                WHERE address_id = :address_id
                  AND customer_id = :customer_id
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                RETURNING
                    address_id,
                    customer_id,
                    address_text,
                    latitude,
                    longitude,
                    created_at,
                    updated_at,
                    franchisee_id
                """
            ),
            {
                "address_id": request.address_id,
                "customer_id": request.customer_id,
                "address_text": address_text,
                "latitude": request.latitude,
                "longitude": request.longitude,
            },
        ).mappings().first()

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Address not found for this customer.",
        )

    return {
        "status": "ok",
        "message": "Customer address updated successfully.",
        "address": address_response(result),
    }


# ============================================================
# Customer Address - Delete
# ============================================================

@router.delete("/address")
def delete_customer_address(
    request: CustomerAddressIdRequest,
):
    """Soft-delete an address belonging to a customer."""

    with engine.begin() as connection:

        result = connection.execute(
            text(
                """
                UPDATE vgf_customer_addresses
                SET
                    is_deleted = TRUE,
                    is_active = FALSE,
                    updated_at = NOW()
                WHERE address_id = :address_id
                  AND customer_id = :customer_id
                  AND is_deleted = FALSE
                RETURNING address_id
                """
            ),
            {
                "address_id": request.address_id,
                "customer_id": request.customer_id,
            },
        )

        deleted_id = result.scalar()

        if deleted_id is None:
            raise HTTPException(
                status_code=404,
                detail="Address not found for this customer.",
            )

        connection.execute(
            text(
                """
                UPDATE vgf_customers
                SET
                    default_address_id = NULL,
                    updated_at = NOW()
                WHERE customer_id = :customer_id
                  AND default_address_id = :address_id
                """
            ),
            {
                "customer_id": request.customer_id,
                "address_id": request.address_id,
            },
        )

    return {
        "status": "ok",
        "message": "Customer address deleted successfully.",
        "address_id": request.address_id,
    }


# ============================================================
# Default Address
# ============================================================

@router.put("/address/default")
def set_default_address(
    request: DefaultAddressRequest,
):
    """Set an existing customer address as default."""

    with engine.begin() as connection:

        address_exists = connection.execute(
            text(
                """
                SELECT address_id
                FROM vgf_customer_addresses
                WHERE address_id = :address_id
                  AND customer_id = :customer_id
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                """
            ),
            {
                "address_id": request.address_id,
                "customer_id": request.customer_id,
            },
        ).scalar()

        if address_exists is None:
            raise HTTPException(
                status_code=404,
                detail="Address not found for this customer.",
            )

        row = connection.execute(
            text(
                """
                UPDATE vgf_customers
                SET
                    default_address_id = :address_id,
                    updated_at = NOW()
                WHERE customer_id = :customer_id
                  AND is_deleted = FALSE
                RETURNING
                    customer_id,
                    default_address_id
                """
            ),
            {
                "customer_id": request.customer_id,
                "address_id": request.address_id,
            },
        ).mappings().first()

        if row is None:
            raise HTTPException(
                status_code=404,
                detail="Customer not found.",
            )

    return {
        "status": "ok",
        "message": "Default address updated successfully.",
        "customer_id": row["customer_id"],
        "default_address_id": row["default_address_id"],
    }


# ============================================================
# Restaurant Listing
# ============================================================

@router.post("/restaurants")
def list_restaurants(
    request: RestaurantLocationRequest,
):
    """
    Return active restaurants from vgf_restaurants.

    The current verified restaurant schema does not expose a
    dedicated city column, so the API returns active restaurants.
    """

    requested_city = request.city.strip()

    if not requested_city:
        raise HTTPException(
            status_code=400,
            detail="City is required.",
        )

    with engine.connect() as connection:

        result = connection.execute(
            text(
                """
                SELECT
                    id,
                    name,
                    description,
                    address,
                    latitude,
                    longitude,
                    phone,
                    email,
                    logo_url,
                    cover_image_url,
                    status,
                    is_active
                FROM vgf_restaurants
                WHERE is_deleted = FALSE
                  AND is_active = TRUE
                ORDER BY name
                """
            )
        )

        rows = result.mappings().all()

    restaurants = [
        jsonable_encoder(dict(row))
        for row in rows
    ]

    return {
        "status": "ok",
        "message": "Restaurants loaded successfully.",
        "city": requested_city,
        "restaurants": restaurants,
    }


# ============================================================
# Restaurant Details
# ============================================================

@router.post("/restaurant/details")
def restaurant_details(
    request: RestaurantIdRequest,
):
    """Return restaurant details."""

    with engine.connect() as connection:

        row = connection.execute(
            text(
                """
                SELECT
                    id,
                    name,
                    description,
                    address,
                    latitude,
                    longitude,
                    phone,
                    email,
                    logo_url,
                    cover_image_url,
                    status,
                    is_active
                FROM vgf_restaurants
                WHERE id = CAST(:restaurant_id AS uuid)
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                LIMIT 1
                """
            ),
            {
                "restaurant_id": request.restaurant_id,
            },
        ).mappings().first()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found.",
        )

    return {
        "status": "ok",
        "message": "Restaurant details loaded successfully.",
        "restaurant": jsonable_encoder(dict(row)),
    }


# ============================================================
# Restaurant Menu
# ============================================================

@router.post("/restaurant/menu")
def restaurant_menu(
    request: RestaurantIdRequest,
):
    """
    Load menu categories and menu items for a restaurant.
    """

    with engine.connect() as connection:

        restaurant_exists = connection.execute(
            text(
                """
                SELECT id
                FROM vgf_restaurants
                WHERE id = CAST(:restaurant_id AS uuid)
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                """
            ),
            {
                "restaurant_id": request.restaurant_id,
            },
        ).scalar()

        if restaurant_exists is None:
            raise HTTPException(
                status_code=404,
                detail="Restaurant not found.",
            )

        categories = connection.execute(
            text(
                """
                SELECT
                    id,
                    name,
                    display_order,
                    status
                FROM vgf_menu_categories
                WHERE restaurant_id = CAST(:restaurant_id AS uuid)
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                ORDER BY display_order NULLS LAST, name
                """
            ),
            {
                "restaurant_id": request.restaurant_id,
            },
        ).mappings().all()

        menu_items = connection.execute(
            text(
                """
                SELECT
                    id,
                    restaurant_id,
                    category_id,
                    name,
                    description,
                    image_url,
                    base_price,
                    food_type,
                    preparation_time_minutes,
                    availability_status,
                    display_order
                FROM vgf_menu_items
                WHERE restaurant_id = CAST(:restaurant_id AS uuid)
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                ORDER BY display_order NULLS LAST, name
                """
            ),
            {
                "restaurant_id": request.restaurant_id,
            },
        ).mappings().all()

    return {
        "status": "ok",
        "message": "Restaurant menu loaded successfully.",
        "restaurant_id": request.restaurant_id,
        "categories": [
            jsonable_encoder(dict(row))
            for row in categories
        ],
        "menu_items": [
            jsonable_encoder(dict(row))
            for row in menu_items
        ],
    }


# ============================================================
# Cart - Add / Create
# ============================================================

@router.post("/cart")
def add_to_cart(
    request: CartRequest,
):
    """
    Create or update the customer's active cart.

    Uses the existing vgf_carts and vgf_cart_items tables.
    """

    if not request.items:
        raise HTTPException(
            status_code=400,
            detail="Cart must contain at least one item.",
        )

    for item in request.items:
        if item.quantity <= 0:
            raise HTTPException(
                status_code=400,
                detail="Quantity must be greater than zero.",
            )

    with engine.begin() as connection:

        customer_exists = connection.execute(
            text(
                """
                SELECT customer_id
                FROM vgf_customers
                WHERE customer_id = :customer_id
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                """
            ),
            {
                "customer_id": request.customer_id,
            },
        ).scalar()

        if customer_exists is None:
            raise HTTPException(
                status_code=404,
                detail="Customer not found.",
            )

        restaurant_exists = connection.execute(
            text(
                """
                SELECT id
                FROM vgf_restaurants
                WHERE id = CAST(:restaurant_id AS uuid)
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                """
            ),
            {
                "restaurant_id": request.restaurant_id,
            },
        ).scalar()

        if restaurant_exists is None:
            raise HTTPException(
                status_code=404,
                detail="Restaurant not found.",
            )

        cart_id = connection.execute(
            text(
                """
                SELECT cart_id
                FROM vgf_carts
                WHERE customer_id = :customer_id
                  AND restaurant_id = CAST(:restaurant_id AS uuid)
                  AND status = 'ACTIVE'
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                ORDER BY cart_id DESC
                LIMIT 1
                """
            ),
            {
                "customer_id": request.customer_id,
                "restaurant_id": request.restaurant_id,
            },
        ).scalar()

        if cart_id is None:

            cart_id = connection.execute(
                text(
                    """
                    INSERT INTO vgf_carts (
                        customer_id,
                        restaurant_id,
                        status,
                        created_at,
                        updated_at,
                        is_active,
                        is_deleted
                    )
                    VALUES (
                        :customer_id,
                        CAST(:restaurant_id AS uuid),
                        'ACTIVE',
                        NOW(),
                        NOW(),
                        TRUE,
                        FALSE
                    )
                    RETURNING cart_id
                    """
                ),
                {
                    "customer_id": request.customer_id,
                    "restaurant_id": request.restaurant_id,
                },
            ).scalar()

        for item in request.items:

            menu_exists = connection.execute(
                text(
                    """
                    SELECT id
                    FROM vgf_menu_items
                    WHERE id = CAST(:menu_id AS uuid)
                      AND restaurant_id = CAST(:restaurant_id AS uuid)
                      AND is_deleted = FALSE
                      AND is_active = TRUE
                    """
                ),
                {
                    "menu_id": item.menu_id,
                    "restaurant_id": request.restaurant_id,
                },
            ).scalar()

            if menu_exists is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Menu item not found: {item.menu_id}",
                )

            existing_item = connection.execute(
                text(
                    """
                    SELECT cart_item_id
                    FROM vgf_cart_items
                    WHERE cart_id = :cart_id
                      AND menu_item_id = CAST(:menu_id AS uuid)
                      AND is_deleted = FALSE
                      AND is_active = TRUE
                    LIMIT 1
                    """
                ),
                {
                    "cart_id": cart_id,
                    "menu_id": item.menu_id,
                },
            ).scalar()

            if existing_item is not None:

                connection.execute(
                    text(
                        """
                        UPDATE vgf_cart_items
                        SET
                            quantity = quantity + :quantity,
                            unit_price_snapshot = :unit_price,
                            updated_at = NOW()
                        WHERE cart_item_id = :cart_item_id
                        """
                    ),
                    {
                        "quantity": item.quantity,
                        "unit_price": item.unit_price,
                        "cart_item_id": existing_item,
                    },
                )

            else:

                connection.execute(
                    text(
                        """
                        INSERT INTO vgf_cart_items (
                            cart_id,
                            menu_item_id,
                            quantity,
                            unit_price_snapshot,
                            created_at,
                            updated_at,
                            is_active,
                            is_deleted
                        )
                        VALUES (
                            :cart_id,
                            CAST(:menu_id AS uuid),
                            :quantity,
                            :unit_price,
                            NOW(),
                            NOW(),
                            TRUE,
                            FALSE
                        )
                        """
                    ),
                    {
                        "cart_id": cart_id,
                        "menu_id": item.menu_id,
                        "quantity": item.quantity,
                        "unit_price": item.unit_price,
                    },
                )

        connection.execute(
            text(
                """
                UPDATE vgf_carts
                SET updated_at = NOW()
                WHERE cart_id = :cart_id
                """
            ),
            {
                "cart_id": cart_id,
            },
        )

    return {
        "status": "ok",
        "message": "Items added to cart successfully.",
        "cart_id": cart_id,
        "customer_id": request.customer_id,
        "restaurant_id": request.restaurant_id,
    }


# ============================================================
# Cart Item Update
# ============================================================

@router.put("/cart/item")
def update_cart_item(
    request: CartItemUpdateRequest,
):
    """Update cart item quantity."""

    if request.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero.",
        )

    with engine.begin() as connection:

        result = connection.execute(
            text(
                """
                UPDATE vgf_cart_items ci
                SET
                    quantity = :quantity,
                    updated_at = NOW()
                FROM vgf_carts c
                WHERE ci.cart_id = c.cart_id
                  AND c.customer_id = :customer_id
                  AND ci.menu_item_id = CAST(:menu_id AS uuid)
                  AND c.status = 'ACTIVE'
                  AND ci.is_deleted = FALSE
                  AND ci.is_active = TRUE
                RETURNING ci.cart_item_id
                """
            ),
            {
                "customer_id": request.customer_id,
                "menu_id": request.menu_id,
                "quantity": request.quantity,
            },
        )

        cart_item_id = result.scalar()

        if cart_item_id is None:
            raise HTTPException(
                status_code=404,
                detail="Cart item not found.",
            )

    return {
        "status": "ok",
        "message": "Cart item updated successfully.",
        "cart_item_id": cart_item_id,
        "quantity": request.quantity,
    }


# ============================================================
# Cart Item Remove
# ============================================================

@router.delete("/cart/item")
def remove_cart_item(
    request: CartItemUpdateRequest,
):
    """Remove an item from the customer's active cart."""

    with engine.begin() as connection:

        result = connection.execute(
            text(
                """
                UPDATE vgf_cart_items ci
                SET
                    is_deleted = TRUE,
                    is_active = FALSE,
                    updated_at = NOW()
                FROM vgf_carts c
                WHERE ci.cart_id = c.cart_id
                  AND c.customer_id = :customer_id
                  AND ci.menu_item_id = CAST(:menu_id AS uuid)
                  AND c.status = 'ACTIVE'
                  AND ci.is_deleted = FALSE
                  AND ci.is_active = TRUE
                RETURNING ci.cart_item_id
                """
            ),
            {
                "customer_id": request.customer_id,
                "menu_id": request.menu_id,
            },
        )

        cart_item_id = result.scalar()

        if cart_item_id is None:
            raise HTTPException(
                status_code=404,
                detail="Cart item not found.",
            )

    return {
        "status": "ok",
        "message": "Cart item removed successfully.",
        "cart_item_id": cart_item_id,
    }


# ============================================================
# Cart View
# ============================================================

@router.post("/cart/view")
def view_cart(
    request: CustomerProfileRequest,
):
    """View the customer's active cart."""

    with engine.connect() as connection:

        cart = connection.execute(
            text(
                """
                SELECT
                    cart_id,
                    customer_id,
                    restaurant_id,
                    status
                FROM vgf_carts
                WHERE customer_id = :customer_id
                  AND status = 'ACTIVE'
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                ORDER BY cart_id DESC
                LIMIT 1
                """
            ),
            {
                "customer_id": request.customer_id,
            },
        ).mappings().first()

        if cart is None:
            return {
                "status": "ok",
                "message": "Cart is empty.",
                "customer_id": request.customer_id,
                "items": [],
                "subtotal": 0,
                "gst_amount": 0,
                "delivery_charge": 0,
                "discount": 0,
                "total_amount": 0,
            }

        items = connection.execute(
            text(
                """
                SELECT
                    ci.cart_item_id,
                    ci.menu_item_id,
                    ci.quantity,
                    ci.unit_price_snapshot,
                    mi.name,
                    mi.image_url
                FROM vgf_cart_items ci
                LEFT JOIN vgf_menu_items mi
                    ON mi.id = ci.menu_item_id
                WHERE ci.cart_id = :cart_id
                  AND ci.is_deleted = FALSE
                  AND ci.is_active = TRUE
                ORDER BY ci.cart_item_id
                """
            ),
            {
                "cart_id": cart["cart_id"],
            },
        ).mappings().all()

    response_items = []

    subtotal = 0.0

    for row in items:

        quantity = int(row["quantity"])
        unit_price = float(row["unit_price_snapshot"])
        line_total = quantity * unit_price

        subtotal += line_total

        response_items.append(
            {
                "cart_item_id": row["cart_item_id"],
                "menu_item_id": str(row["menu_item_id"]),
                "name": row["name"],
                "image_url": row["image_url"],
                "quantity": quantity,
                "unit_price": unit_price,
                "line_total": line_total,
            }
        )

    return {
        "status": "ok",
        "message": "Cart loaded successfully.",
        "cart_id": cart["cart_id"],
        "customer_id": cart["customer_id"],
        "restaurant_id": str(cart["restaurant_id"]),
        "items": response_items,
        "subtotal": subtotal,
        "gst_amount": 0,
        "delivery_charge": 0,
        "discount": 0,
        "total_amount": subtotal,
    }


# ============================================================
# Checkout
# ============================================================

@router.post("/checkout")
def customer_checkout(
    request: CheckoutRequest,
):
    """
    Validate checkout information.

    Final order creation and payment gateway processing remain
    separate operations.
    """

    with engine.connect() as connection:

        customer_exists = connection.execute(
            text(
                """
                SELECT customer_id
                FROM vgf_customers
                WHERE customer_id = :customer_id
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                """
            ),
            {
                "customer_id": request.customer_id,
            },
        ).scalar()

        if customer_exists is None:
            raise HTTPException(
                status_code=404,
                detail="Customer not found.",
            )

        address_exists = connection.execute(
            text(
                """
                SELECT address_id
                FROM vgf_customer_addresses
                WHERE address_id = :address_id
                  AND customer_id = :customer_id
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                """
            ),
            {
                "address_id": request.address_id,
                "customer_id": request.customer_id,
            },
        ).scalar()

        if address_exists is None:
            raise HTTPException(
                status_code=404,
                detail="Delivery address not found.",
            )

        cart = connection.execute(
            text(
                """
                SELECT
                    cart_id,
                    restaurant_id
                FROM vgf_carts
                WHERE customer_id = :customer_id
                  AND restaurant_id = CAST(:restaurant_id AS uuid)
                  AND status = 'ACTIVE'
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                ORDER BY cart_id DESC
                LIMIT 1
                """
            ),
            {
                "customer_id": request.customer_id,
                "restaurant_id": request.restaurant_id,
            },
        ).mappings().first()

        if cart is None:
            raise HTTPException(
                status_code=400,
                detail="Active cart not found.",
            )

        items = connection.execute(
            text(
                """
                SELECT
                    quantity,
                    unit_price_snapshot
                FROM vgf_cart_items
                WHERE cart_id = :cart_id
                  AND is_deleted = FALSE
                  AND is_active = TRUE
                """
            ),
            {
                "cart_id": cart["cart_id"],
            },
        ).mappings().all()

    if not items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty.",
        )

    subtotal = sum(
        int(item["quantity"])
        * float(item["unit_price_snapshot"])
        for item in items
    )

    return {
        "status": "ok",
        "message": "Checkout details validated successfully.",
        "customer_id": request.customer_id,
        "restaurant_id": request.restaurant_id,
        "address_id": request.address_id,
        "offer_code": request.offer_code,
        "cart_id": cart["cart_id"],
        "subtotal": subtotal,
        "gst_amount": 0,
        "delivery_charge": 0,
        "discount": 0,
        "total_amount": subtotal,
    }