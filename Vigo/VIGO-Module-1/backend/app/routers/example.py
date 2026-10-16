"""Example router showing the SWAIS route convention.

Paths have NO role prefix — this router is reachable as:
  local dev : http://localhost:8001/examples
  staging   : https://staging.sgs.swais.in/api/<role>/examples  (Nginx strips /api/<role>/)
"""

from fastapi import APIRouter

router = APIRouter(prefix="/examples", tags=["examples"])


@router.get("")
def list_examples():
    return [{"id": 1, "name": "example"}]
