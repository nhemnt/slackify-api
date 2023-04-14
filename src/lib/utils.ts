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

// This function normalizes the OpenGraph data
export const normalizeOGData = (ogData: OpenGraphData): NormalizedOGData => {
  const {
    ogTitle,
    ogUrl,
    ogDescription,
    ogImage,
    twitterImage,
    twitterDescription,
    requestUrl,
    ogSiteName,
  } = ogData;

  const image =
    (Array.isArray(ogImage) ? ogImage[0]?.url : ogImage?.url) ||
    twitterImage?.url;

  return {
    title: ogTitle,
    url: ogUrl || requestUrl,
    description: ogDescription || twitterDescription,
    image,
    ogSiteName,
  };
};

/**
 * Creates Slack blocks based on the given normalized OG data.
 * @param data An array of NormalizedOGData objects
 * @returns An array of Slack block objects
 */
export const createSlackBlocks = (data: NormalizedOGData[]) => {
  const blocks: any = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Stay Informed with the Top Stories of the Week 😎',
        emoji: true,
      },
    },
    {
      type: 'divider',
    },
  ];
  data.forEach((item: NormalizedOGData) => {
    const { title, url, description, image } = item;

    if (blocks.length > 40) return blocks;
    if (title || description || image) {
      if (image && !image.includes('.svg')) {
        blocks.push({
          type: 'image',
          title: {
            type: 'plain_text',
            text: title,
            emoji: true,
          },
          image_url: encodeURI(image),
          alt_text: title,
        });
      }

      if (description) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${title}* \n\n${description} \n\n`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Read More',
              emoji: true,
            },
            url: encodeURI(url || ''),
            action_id: 'button-action',
          },
        });
        blocks.push({
          type: 'divider',
        });
      }
    }
  });
  return blocks;
};

export function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
