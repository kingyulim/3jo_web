$(document).ready(function(){
    const member_list_wrap = $("#member_list_wrap");

    member_list_wrap.on("click", "li", function(){
        const this_name = $(this).data("name");

        if(!this_name){
            alert('데이터가 빈 값입니다.');
            return;
        }

        // 이미 열려있으면 제거 후 다시 열기
        $(".my_popup_layer").remove();

        const layer = `
            <div class="my_popup_layer">
                <div class="inner_wrap container">
                    <iframe src="./team_folder/${this_name}.html" style="width: 100%; height: 100%; padding: 16px"></iframe>
                </div>
            </div>
        `;

        $("body").append(layer);

        const my_popup_layer = $(".my_popup_layer");

        // 중복 이벤트 방지
        my_popup_layer.off("click").on("click", function(e){
            if($(e.target).is(my_popup_layer)){
                my_popup_layer.remove();
            }
        });
    });
});