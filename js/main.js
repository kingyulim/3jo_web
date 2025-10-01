$(document).ready(function(){
    const member_list_wrap = $("#member_list_wrap");

    member_list_wrap.on("click mouseenter mouseleave", "li[data-name]", function(e){
        const t = $(this);
        const this_name = t.data("name");

        switch(e.type){
            case "click" : 
               if(this_name == null || this_name === ""){
                    alert("데이터가 빈 값입니다.");
                    return;
                }

                if($(".my_popup_layer").length > 0) return;

                const layer = `
                    <div class="my_popup_layer">
                        <div class="inner_wrap container" style="padding: 16px;">
                            <iframe src="./team_folder/${this_name}.html" style="width: 100%; height: 100%; border: 0;"></iframe>
                        </div>
                    </div>
                `;

                $("body").append(layer);

                $(document).on("click", ".my_popup_layer", function(e){
                    if ($(e.target).is(".my_popup_layer")) {
                        $(this).remove();
                    }
                });

                break;

            case "mouseenter" :
                const img_item = t.find(".my_img").children();  
                const item_count = img_item.length;

                if(item_count <= 1) return;

                let index = 0;

                img_item.hide().eq(0).show();

                fade_slide = setInterval(function(){
                    const current = img_item.eq(index);
                    index = (index + 1) % item_count;
                    const next = img_item.eq(index);

                    current.fadeOut(300, function() {
                        next.fadeIn(300);
                    });        
                }, 2000);
                

                break;
            
            case "mouseleave" :
                clearInterval(fade_slide);
                fade_slide = null;

                t.find(".my_img").children().hide().eq(0).show();    

                break;
        } 
    });
});