export enum FollowCategory {
  Classic = 0,
  HighQuality = 1,
  New = 2,
  ToiletPaper = 4,
  Masterpiece = 5,
}

export namespace FollowCategory {
  // 获取所有 FollowCategory 的值
  export function getAllValues(): FollowCategory[] {
    return Object.values(FollowCategory).filter(value => typeof value === 'number') as FollowCategory[];
  }

  // 获取 FollowCategory 的字符串映射
  export function getStringMapping(): { [key: string]: string } {
    return {
      Classic: '经典',
      HighQuality: '高质量',
      New: '新番',
      ToiletPaper: '厕纸',
      Masterpiece: '神作',
    };
  }
}

export enum FollowStatus {
  WantToWatch = 0,
  Watching = 1,
  Watched = 2,
}

export namespace FollowStatus {
  // 获取所有 FollowStatus 的值
  export function getAllValues(): FollowStatus[] {
    return Object.values(FollowStatus).filter(value => typeof value === 'number') as FollowStatus[];
  }

  // 获取 FollowStatus 的字符串映射
  export function getStringMapping(): { [key: string]: string } {
    return {
      WantToWatch: '想看',
      Watching: '在看',
      Watched: '看过',
    };
  }
}