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
                        <iframe class="hide_scroll" src="${window.location.href}/team_folder/${this_name}.html" style="width: 100%; height: 100%; padding: 16px" ></iframe>
                    </div>
                </div>
            `;

            $("body").append(layer);
        }

        const my_popup_layer = $(".my_popup_layer");

        my_popup_layer.click(function(e){
            const l_t = $(e.target);

            if(l_t.is(my_popup_layer)){
                my_popup_layer.remove();
            }
        });

        /*
        $(".my_popup_layer > .inner_wrap").load("./team_folder/" + this_name + ".html .container", function(){
            const my_popup_layer = $(".my_popup_layer");

            my_popup_layer.click(function(e){
                const l_t = $(e.target);

                if(l_t.is(my_popup_layer)){
                    my_popup_layer.remove();
                }
            });
        });
        */
    });
});