$(document).ready(function(){

   $("div.change").mouseenter(function(){

   	 var id = $(this).attr('id');

     console.log(id);

   	 $('a').removeClass('active');
   	 $("[href=#"+id+"]").addClass('active');
   });


});

$(window).scroll(function() {

    if ($(this).scrollTop()>10)
     {
        $('#jump').hide("fast");
     }
    else
     {
      $('#jump').fadeIn("fast");
     }
 });
