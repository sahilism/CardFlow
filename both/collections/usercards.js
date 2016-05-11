userCards = new Mongo.Collection('usercards');
var Schemas = {};

Schemas.userCards = new SimpleSchema({
    user_id: {
        type: String,
        label: "userid"
    },
    cardTitle: {
        type: String,
        label: "title",
        optional: true
    },
    inboxTitle: {
        type: String,
        label: "title",
        optional: true
    },
    parent_id: {
        type: String,
        label: "parent card",
        optional: true
    },
    is_selected: {
        type: Boolean,
        label: "is selected",
        optional: true
    },
    createdAt: {
        type: Number,
        label: "created at",
        optional: true
    },
    has_children:{
        type: Boolean,
        label: "has childred",
        optional: true
    },
    is_completed:{
        type: Boolean,
        label: "Is Completed",
        optional: true
    },
    is_pinned:{
        type: Boolean,
        label: "Is pinned",
        optional: true
    },
    remind_at: {
        type: String,
        label: "Remind in",
        optional: true
    },
    notes: {
        type: String,
        label: "Notes",
        optional: true
    },
    color: {
        type: String,
        label: "Notes",
        optional: true
    },
});
userCards.attachSchema(Schemas.userCards)