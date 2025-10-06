$(document).ready(function(){
    const member_dic = {
        "kim_gyu_lim" : {
            "name" : "김규림",
            "resolution" : "모든 업무에 있어 끝까지 책임을 다할 것을 약속드립니다.",
            "img" : ["./img/kim_gyu_lim/profile_img.jpg", "./img/kim_gyu_lim/activity (1).jpg", "./img/kim_gyu_lim/activity (3).jpg", "./img/kim_gyu_lim/activity (8).jpg"]
        },

        "lee_seoyeon" : {
            "name" : "이서연",
            "resolution" : "작은 일도 소홀히 하지 않고, 끝까지 최선을 다하겠습니다.",
            "img" : ["./img/lee_seoyeon/profile1.png", "./img/lee_seoyeon/profile2.jpg", "./img/lee_seoyeon/profile3.png", "./img/lee_seoyeon/profile4.png"]
        },

        "jang_seo_yeon" : {
            "name" : "장서연",
            "resolution" : "적당히 살지 말자.",
            "img" : ["./img/jang_seo_yeon/1.jpg", "./img/jang_seo_yeon/2.jpg"]
        },

        "jeoung_ha_ryun" : {
            "name" : "정하륜",
            "resolution" : "모두에게 도움되는 개발자가 되고 싶습니다.",
            "img" : ["./img/Jeong_ha_ryun/JHR_Profile_img.JPG", "./img/Jeong_ha_ryun/JHR_danang_img.JPG", "./img/Jeong_ha_ryun/JHR_dubai_img.JPG", "./img/Jeong_ha_ryun/JHR_Fubao_img.jpeg", "./img/Jeong_ha_ryun/JHR_jeju_img.JPG"]
        }
    }

    $.each(member_dic, function(key, value){
        let layer = `
            <li data-name="${key}">
                <ul class="my_img"></ul>
                <div class="my_contnet_box">
                    <p class="my_name">
                        <strong>${value.name}</strong>
                    </p>

                    <p class="resolution">${value.resolution}</p>
                </div>

                <span class="view_icon">상세히보기</span>
            </li>
        `;

        $("#member_list_wrap").append(layer);

        let my_img_container = $("#member_list_wrap li[data-name='" + key + "'] .my_img"),
            img_layer = null;

        if(value.img.length > 0){
            value.img.forEach(img_src => {
                img_layer = `
                    <li>
                        <img src="${img_src}">
                    </li>
                `;

                my_img_container.append(img_layer);
            });
        }else{
            img_layer = `
                <li class="no_data">
                    이미지 없음
                </li>
            `;

            my_img_container.append(img_layer);
        }
    });

    // 메인 리스트 스크립트
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
                            <button class="close_btn" type="button">메인으로</button>

                            <iframe src="./team_folder/${this_name}.html" style="width: 100%; border: 0;"></iframe>
                        </div>
                    </div>
                `;

                $("body").append(layer);

                $(document).on("click", ".my_popup_layer", function(e){
                    if ($(e.target).is(".my_popup_layer") || $(e.target).is(".close_btn")) {
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

                    current.fadeOut(200, function() {
                        next.fadeIn(200);
                    });        
                }, 1500);

                break;
            
            case "mouseleave" :
                clearInterval(fade_slide);
                fade_slide = null;

                t.find(".my_img").children().hide().eq(0).show();    

                break;
        } 
    });

    // 목표 텍스트 스크립트
    const goals_text = '“어떤 상황에서도 잘하겠다는 마음을 잃지 말자.\n오늘의 노력들이 쌓여 더 나은 내가 되도록 하자.”';

    let i = 0;
    let output = "";

    setInterval(function(){
        if (i >= goals_text.length) return;

        output += goals_text[i] === "\n" ? "<br/>" : goals_text[i];

        $("#main_page_head .text").html(output);

        i++;
    }, 80);

    // 네비 버튼 스크립트
    $("#fixed_nav button").click(function(){
        const t = $(this);
        const this_data = t.data("article");

        t.addClass("on").siblings().removeClass("on");

        switch(this_data){
            case "member_intro" : 
                $("#guest_book_article").fadeOut();
                $("#member_list_article").show();

                setTimeout(function(){
                    member_intro_fn(0, 1, 500);         
                }, 500);   

                break;
            
            case "guest_book" : 
                member_intro_fn(-300, 0, 500);

                setTimeout(function(){
                    $("#member_list_article").hide();

                    $("#guest_book_article").fadeIn(500);
                }, 500);

                break;
        }

        function member_intro_fn(a, b, time){
            $("#member_list_wrap > li:nth-of-type(odd)").animate({
                "left" : a,
                "opacity" : b
            }, time);

            $("#member_list_wrap > li:nth-of-type(even)").animate({
                "right" : a,
                "opacity" : b
            }, time);
        }
    });
});

function format_datetime() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}