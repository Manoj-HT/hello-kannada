type UserData = {
   lastCompletedChapter: string;
   skippedChapters: string[];
   syncLink?: string;
   updatedAt: number;
};

type AppConfig = {
    appVersion: string;
    contentVersion: string;
    lastUpdatedOn: number;
    notificationMessage: string;
    isCritical: boolean;
}

type ChangeLog = {
    version: string;
    changes: string[];
}