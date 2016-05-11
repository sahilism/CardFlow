Template.signin.rendered = function () {

	var typeCards=function () {
		$(".cards-area").append('<div class="demo-list parent1 "><input type="text" class="demo-input active" id="demo-parent1"></div>');
		$('#demo-parent1').typetype('Parent card1',{
			e: 0,
			t: 200,
			callback: function(){
				$(".cards-area").append('<div class="demo-list child1 "><input type="text" class="demo-input active" id="demo-parent2"></div>')
				$('#demo-parent2').typetype('child card1',{
					e: 0,
					t: 200,
					callback : function(){
						$("#demo-parent2").removeClass('active');
						$(".child1").append('<input type="text" class="demo-input active " id="demo-parent3">')
						$('#demo-parent3').typetype('child card2', {
							e: 0,
							t: 200,
							callback : function(){
								$("#demo-parent1").removeClass('active');
								$(".child1").remove();
								$(".parent1").append('<input type="text" class="demo-input active" id="demo-parent4">')
								$('#demo-parent4').typetype('Parent card2',{
									e: 0,
									t: 200,
									callback:function(){
										$(".cards-area").html("");
										typeCards();
									}
								});
								
							}
						});
					}
				});		
			}
		});		
	}
	// typeCards();
};