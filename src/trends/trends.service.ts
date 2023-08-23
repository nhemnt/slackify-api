import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  createSlackBlocks,
  isValidHttpUrl,
  normalizeOGData,
} from '../lib/utils';

interface UrlData {
  url: string;
  title?: string;
}

interface JsonData {
  urls: UrlData[];
}

interface OGresult {
  error: boolean;
  result: any;
  response: any;
}
interface OpenGraphData {
  ogTitle?: string;
  ogUrl?: string;
  ogDescription?: string;
  ogImage?: { url: string } | Array<{ url: string }>;
  ogSiteName?: string;
  twitterImage?: { url: string };
  twitterDescription?: string;
  requestUrl?: string;
}

interface NormalizedOGData {
  title?: string;
  url?: string;
  description?: string;
  image?: string;
  ogSiteName?: string;
}
@Injectable()
export class TrendsService {
  async create(json: JsonData) {
    return new Promise((resolve) => {
      const { WEBHOOK_URI } = process.env;
      const excludedList = JSON.parse(process.env.EXCLUDED_LIST || '') || [];
      const excludeDomain = JSON.parse(process.env.EXCLUDED_DOMAIN || '') || [];
      const regex = new RegExp(excludedList.join('|'), 'i');
      const excludeDomainRegex = new RegExp(excludeDomain.join('|'), 'i');
      // Filter out unwanted data from JSON
      const filteredList = json.urls.filter((str: UrlData) => {
        if (!str?.title) {
          return false;
        }
        return !regex.test(str.title);
      });

      try {
        const seenUrls = new Set<string>();
        const uniqueData = filteredList.filter((item: UrlData) => {
          if (seenUrls.has(item.url)) {
            return false;
          } else {
            seenUrls.add(item.url);
            return true;
          }
        });

        const promises: Promise<OGresult>[] = [];
        uniqueData.forEach((list: UrlData) => {
          const options = { url: list.url };
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const ogs = require('open-graph-scraper');
          promises.push(ogs(options));
        });
        Promise.allSettled(promises).then(async (results) => {
          const data: OpenGraphData[] = [];
          results.forEach((result) => {
            if (result.status === 'fulfilled' && result.value.result) {
              data.push(result.value.result);
            }
          });

          // Filter out unwanted domains from OpenGraph data
          const filteredData = data
            .map(normalizeOGData)
            .filter((str: NormalizedOGData) => {
              const url = str.url || '';
              const siteName = str.ogSiteName || '';
              const imageUrl = str.image || '';
              if (url && !isValidHttpUrl(url)) return false;
              if (imageUrl && !isValidHttpUrl(imageUrl)) return false;
              return !excludeDomainRegex.test(url || siteName);
            });
          const blocks = await createSlackBlocks(filteredData);
          if (WEBHOOK_URI) {
            try {
              await axios.post(WEBHOOK_URI, {
                blocks: blocks,
              });
            } catch (err) {
              resolve({ error: 'Invalid block data', blocks });
            }
          }

          // Send response with normalized OpenGraph data
          resolve({ result: blocks });
        });
      } catch (err: any) {
        // err contains sensitive info
        resolve({
          message: 'Something Went Wrong!',
        });
      }
    });
  }
}
