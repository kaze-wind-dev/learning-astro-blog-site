import type { MicroCMSListContent,MicroCMSListResponse } from "microcms-js-sdk";

export type Category = {
    name: string;
} & MicroCMSListContent;

export type Blog = {
  title: string;
  thumbnail?: string;
  content: string;
  description: string;
  category?: string;
} & MicroCMSListContent;

export type BlogList = MicroCMSListResponse<Blog>;