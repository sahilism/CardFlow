userCards = new Mongo.Collection('usercards');
var Schemas = {};

Schemas.userCards = new SimpleSchema({
    user_id: {
        type: String,
        label: "userid",
        optional: true
    },
    cardTitle: {
        type: String,
        label: "title",
        optional: true
    },
    parent_id: {
        type: String,
        label: "parent card",
        optional: true
    },
    createdAt: {
        type: Number,
        label: "created at",
        optional: true
    }
});
userCards.attachSchema(Schemas.userCards)