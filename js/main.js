$(document).ready(function(){
    const member_list_wrap = $("#member_list_wrap");

    member_list_wrap.on("click", "li", function(){
        const t = $(this);
        const this_name = t.data("name");

        if(this_name == null){
            alert('데이터가 빈 값입니다.');

            return;
        }

        if($(".my_popup_layer").length === 0){
            const layer = `
                <div id="${this_name}_layer_popup" class="my_popup_layer">
                    <div class="inner_wrap container">
                    </div>
                </div>
            `;

            $("body").append(layer);
        }

        /*
        $(".my_popup_layer > .inner_wrap").load("./team_folder/" + this_name + ".html", function(){
            const my_popup_layer = $(".my_popup_layer");

            my_popup_layer.click(function(e){
                const l_t = $(e.target);

                if(l_t.is(my_popup_layer)){
                    my_popup_layer.remove();
                }
            })
        });
        */
    });
});