from backend.tests_utils import WeakAuthenticationBaseTestCase

# Please see the comments on test_page.yaml to get a better understanding of the test fixtures.

ALL_USERS = [
    "17admin_biero",
    "17member_biero",
    "17page_biero",
    "17admin_pdm",
    "17member_pdm",
    "17page_pdm",
]
"""A list of user ids covering all the spectrum of roles and permissions."""

ALL_USERS_EXCEPT_PAGE_BIERO = [user for user in ALL_USERS if user != "17page_biero"]
"""Same as ALL_USERS, but with 17page_biero removed."""

ALL_USERS_EXCEPT_PAGE_ADMIN = [user for user in ALL_USERS if "page" not in user]
"""Same as ALL_USERS, but with 17page* removed."""

ALL_USERS_EXCEPT_ADMIN = [user for user in ALL_USERS if "admin" not in user]
"""Same as ALL_USERS, but with all the association administrators removed."""


class BasePageTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_page.yaml"]

    def endpoint_list(self, association_id):
        """Return the endpoint associated to the list association page action."""
        return f"/associations/pages/"

    def list(self, association_id):
        return self.get(self.endpoint_list(association_id))

    def endpoint_retrieve(self, pk, association_id):
        """Return the endpoint associated to the retrieve action."""
        return f"/associations/pages/{pk}/"

    def retrieve(self, pk, association_id):
        return self.get(self.endpoint_retrieve(pk, association_id))

    def endpoint_create(self, association_id):
        """Return the endpoint associated to the create action."""
        return f"/associations/pages/"

    def create(self, association_id, data=None, format="json"):
        return self.post(self.endpoint_create(association_id), data, format)

    def endpoint_update(self, pk, association_id):
        """Return the endpoint associated to the update action."""
        return f"/associations/pages/{pk}/"

    def update(self, pk, association_id, data=None, format="json"):
        return self.patch(self.endpoint_update(pk, association_id), data, format)

    def endpoint_destroy(self, pk, association_id):
        """Return the endpoint associated to the destroy action."""
        return f"/associations/pages/{pk}/"

    def destroy(self, pk, association_id):
        return self.delete(self.endpoint_destroy(pk, association_id))
