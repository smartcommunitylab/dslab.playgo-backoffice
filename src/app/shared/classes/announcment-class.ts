import { Announcement } from "src/app/core/api/generated/model/announcement";

export class AnnouncementClass implements Announcement {
    channels?: Array<Announcement.ChannelsEnum>;
    description?: string;
    from?: string;
    html?: string;
    players?: Array<string>;
    timestamp?: number;
    title?: string;
    to?: string;
  }
