import { Tag } from "../tag";
import { Association } from "./association";

export interface Media {
  id: string;
  uploadedOn: Date;
  uploadedBy: Date;
  url: string;
  tags: Tag[];
  name: string;
  description: string;
  association: Association;
  type: string;
  media: string;
  mimetype: string;
}
