import type {
  MicroCMSQueries,
  MicroCMSListContent,
  MicroCMSContentId,
  CustomRequestInit,
} from "microcms-js-sdk";

import type { Blog } from "../../types/microcms";

import { createClient } from "microcms-js-sdk";

const serciveDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

if (!serciveDomain || !apiKey) {
  throw new Error("MICROCMS_SERVICE_DOMAIN or MICROCMS_API_KEY is not set");
}

const client = createClient({
  serviceDomain: serciveDomain,
  apiKey: apiKey,
});

// 記事の一覧取得用の共通関数
export const getPosts = async <T>(
  endpoint: string,
  queries?: MicroCMSQueries,
  customRequestInit?: CustomRequestInit
) => {
  try {
    const data = await client.getList<T>({
      endpoint,
      queries,
      customRequestInit,
    });
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(message, error);
    throw new Error(message);
  }
};

// ブログ一覧取得
export const getBlogList = async (queries?: MicroCMSQueries) => {
  return getPosts<Blog>("blog", queries);
};

// ブログ詳細取得
export const getBlogDetail = async (id: string) => {
  try {
    const data = await client.get<Blog>({
     endpoint: "blog",
     contentId: id,
    });
    return data;
  } catch (error) {
    const message =
    error instanceof Error ? error.message : "An unknown error occurred";
    console.error(message, error);
    throw new Error(message);
  }
};