from associations.models import Media, Folder
from tags.tests.base_test import BaseTestCase


class TagNamespaceInheritanceTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_tag_inheritance.yaml"]

    def test_deep_inheritance(self):
        self.login("17admin")

        # Add the tag
        res = self.post("/tags/link/folder/1/tag/1/")
        self.assertStatusCode(res, 201)

        for file in Media.objects.all():
            tags = file.inherited_tags.all()
            self.assertEqual(len(tags), 1)
            self.assertEqual(tags[0].id, 1)
            self.assertEqual(len(file.tags.all()), 0)

        for folder in Folder.objects.all():
            if folder.id == 1:
                self.assertEqual(len(folder.tags.all()), 1)
            else:
                tags = folder.inherited_tags.all()
                self.assertEqual(len(tags), 1)
                self.assertEqual(tags[0].id, 1)
                self.assertEqual(len(folder.tags.all()), 0)

        # Remove the tag
        res = self.delete("/tags/link/folder/1/tag/1/")
        self.assertStatusCode(res, 204)

        for file in Media.objects.all():
            self.assertEqual(len(file.inherited_tags.all()), 0)
            self.assertEqual(len(file.tags.all()), 0)

        for folder in Folder.objects.all():
            self.assertEqual(len(folder.inherited_tags.all()), 0)
            self.assertEqual(len(folder.tags.all()), 0)

    def assert_deep_has_inherited_tag(self, folder, tag_pk):
        for file in folder.files.all():
            self.assertEqual(len(file.tags.all()), 0)
            self.assertEqual(len(file.inherited_tags.all()), 1)
            self.assertEqual(file.inherited_tags.all()[0].id, 1)

        for child in folder.children.all():
            self.assert_deep_has_inherited_tag(child, tag_pk)
            self.assertEqual(
                len(child.tags.all()),
                0,
                msg="Folder {} has {} tags instead of {}".format(
                    child.id, len(child.tags.all()), 0
                ),
            )
            self.assertEqual(
                len(child.inherited_tags.all()),
                1,
                msg="Folder {} has {} tags instead of {}".format(
                    child.id, len(child.tags.all()), 1
                ),
            )
            self.assertEqual(child.inherited_tags.all()[0].id, 1)

    def assert_deep_has_no_tag_at_all(self, folder):
        self.assertEqual(len(folder.tags.all()), 0)
        self.assertEqual(len(folder.inherited_tags.all()), 0)

        for file in folder.files.all():
            self.assertEqual(len(file.tags.all()), 0)
            self.assertEqual(len(file.inherited_tags.all()), 0)

        for child in folder.children.all():
            self.assert_deep_has_no_tag_at_all(child)

    def test_inheritance_does_not_impact_parents(self):
        self.login("17admin")

        # Add the tag
        res = self.post("/tags/link/folder/2/tag/1/")
        self.assertStatusCode(res, 201)

        folder_1 = Folder.objects.get(pk=1)
        self.assertEqual(len(folder_1.tags.all()), 0)
        self.assertEqual(len(folder_1.inherited_tags.all()), 0)

        folder_2 = Folder.objects.get(pk=2)
        self.assertEqual(len(folder_2.tags.all()), 1)
        self.assertEqual(len(folder_2.inherited_tags.all()), 0)
        self.assertEqual(folder_2.tags.all()[0].id, 1)
        self.assert_deep_has_inherited_tag(folder_2, 1)

        folder_3 = Folder.objects.get(pk=3)
        self.assert_deep_has_no_tag_at_all(folder_3)
