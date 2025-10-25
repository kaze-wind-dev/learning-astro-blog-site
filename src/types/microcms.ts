import type { MicroCMSListContent,MicroCMSListResponse,MicroCMSImage } from "microcms-js-sdk";

export type Category = {
    name: string;
} & MicroCMSListContent;

export type Blog = {
  title: string;
  thumbnail?: MicroCMSImage;
  content: string;
  description: string;
  category?: string;
} & MicroCMSListContent;

export type BlogList = MicroCMSListResponse<Blog>;