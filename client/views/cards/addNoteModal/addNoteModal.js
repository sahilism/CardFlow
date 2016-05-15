Template.addNoteModal.events({
  'keydown #quickNote': function (e, t) {
    if(e.keyCode === 13){
      var text = e.currentTarget.value;
      saveQuickNote(text);
    }
  },
  'click #saveQuickNote': function(){
    var text = $("#quickNote").val();
    saveQuickNote(text);
  }
});

function saveQuickNote(text){
  if(!text){
    toastr.error("Please add some text");
    return;
  }
  userCards.insert({user_id:Meteor.userId(),inboxTitle: text,has_children: false,is_selected:false,parent_id:"inbox",createdAt:Date.now()});
  toastr.success("Note saved to inbox",'', { timeOut: 500 });
  $("#quickNote").val("");
  $("#addNoteModal").modal('hide')
}
Template.addNoteModal.onRendered(function(){
  $('#addNoteModal').on('shown.bs.modal', function() {
    $("#quickNote").focus();
  })
})