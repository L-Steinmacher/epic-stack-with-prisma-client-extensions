// We keep the type for the enum in a separate file so that we can import it
// into both client and server code.
export const PriorityEnum = {
    IMPORTANT: "Important!",
    MODERATE: "Moderate",
    LOW: "Low",
    BACKLOG: "Backlog"
} as const;