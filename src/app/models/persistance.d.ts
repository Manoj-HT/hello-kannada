type TopicStatus = {
    completed: boolean;
    lastAttemptAt?: number;
    firstAttemptAt?: number;
    // confidence: 'low' | 'medium' | 'high'
    // attempts: number;
};

type UserData = {
    progress: {
        [topicId: string]: TopicStatus;
    };
    syncLink: string;
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