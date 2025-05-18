interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    place: string;
    maxParticipants: number | null;
    recurrence: string;
    subscriptions: any[];
}