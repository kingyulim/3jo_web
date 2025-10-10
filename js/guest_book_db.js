// Firebase SDK 라이브러리 가져오기
import{
    initializeApp
}from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

import{
    getCountFromServer,
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    limit,
    startAfter
}from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 설정
const firebase_config = {
    apiKey:"AIzaSyDCTjFYPvh6kpZamGxWy8i3MLXCQlEZzfc",
    authDomain:"kingyulim-project.firebaseapp.com",
    projectId:"kingyulim-project",
    storageBucket:"kingyulim-project.firebasestorage.app",
    messagingSenderId:"983651940781",
    appId:"1:983651940781:web:7cdc2f47e6b23a7a3f0924",
    measurementId:"G-2M5TW30KYB"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebase_config);
const db = getFirestore(app);

const guest_book_list = $("#guest_book_article .list_wrap"),
      book_guest_count_text = $("#book_guest_count b");

let last_visible = null,
    loaded_count = 0,
    total_count = 0,
    order_by = "desc";

const load_limit = 5;

const guest_book_total = await getCountFromServer(query(collection(db, "guest_book")));
total_count = guest_book_total.data().count;

let guest_book_query = query(collection(db,"guest_book"), orderBy("order_time", order_by), limit(load_limit));
let guest_book_dic = await getDocs(guest_book_query);

const guest_book_list_more_layer=`
    <button id="guest_book_list_more" class="df_btn" type="button">
        더보기
        <br>
        ↓
    </button>
`;

if(guest_book_dic.docs.length > 0){
    $.each(guest_book_dic.docs,function(index,value){
        const row = value.data();
        guest_book_list.append(list_layer_fn(value.id,row.name,row.datetime,row.content));
    });

    last_visible = guest_book_dic.docs[guest_book_dic.docs.length-1];
    loaded_count += guest_book_dic.docs.length;

    book_guest_count_text.text(total_count);

    if(total_count > load_limit){
        guest_book_list.after(guest_book_list_more_layer);
    }
}else{
    guest_book_list.append(`<li class="no_data">작성된 방명록이 없습니다.</li>`);
}

$(document).on("click", "#guest_book_list_more", async function(){
    guest_book_query = query(collection(db,"guest_book"), orderBy("order_time", order_by), startAfter(last_visible), limit(load_limit));
    guest_book_dic = await getDocs(guest_book_query);

    $.each(guest_book_dic.docs,function(index,value){
        const row = value.data();
        guest_book_list.append(list_layer_fn(value.id, row.name, row.datetime, row.content));
    });

    last_visible = guest_book_dic.docs[guest_book_dic.docs.length-1];
    loaded_count += guest_book_dic.docs.length;

    if(loaded_count >= total_count){
        $(this).remove();
    }
});


guest_book_list.on("click",".util_btn",async function(){
    const t = $(this);
    const this_id = t.closest("li[data-id]").data("id");

    const get_this_list=await getDoc(doc(db, "guest_book", this_id));

    if(!get_this_list.exists()){
        alert("존재하지 않는 데이터입니다.");
        
        return;
    }

    const password_prompt=prompt("비밀번호를 입력해주세요.");
    if(!password_prompt) return;

    const row = get_this_list.data();
    if(row.password !== password_prompt){
        alert("비밀번호가 일치하지 않습니다.");

        return;
    }

    switch(t.attr("btn_util")){
       case "remove_btn" :
           await deleteDoc(doc(db, "guest_book", this_id));

           alert("삭제되었습니다.");

           t.closest("li[data-id]").remove();

           const updated_total = await getCountFromServer(query(collection(db, "guest_book")));
           total_count = updated_total.data().count;

           book_guest_count_text.text(total_count);

           if(guest_book_list.find("li[data-id]").length === 0 && guest_book_list.find(".no_data").length === 0){
               guest_book_list.append('<li class="no_data">작성된 방명록이 없습니다.</li>');
           }

           if(loaded_count >= total_count){
               $("#guest_book_list_more").remove();
           }

           break;

        case "edit_btn" :
            const this_list_element = $("li[data-id='"+this_id+"']");
            this_list_element.find(".content").remove();

            const edit_textarea=`
                <div class="edit_textarea_box">
                    <textarea placeholder="수정할 내용을 작성해주세요." maxlength="1000">${row.content}</textarea>
                    <div class="btn_box">
                        <button class="ed_util_btn df_btn" btn_util="cencle" type="button">취소</button>
                        <button class="ed_util_btn df_btn" btn_util="edit" type="button">수정</button>
                    </div>
                </div>
            `;

            this_list_element.find(".list_head").after(edit_textarea);

            this_list_element.find(".edit_textarea_box").off("click").on("click",".ed_util_btn",async function(){
                const i_t = $(this);
                let content_data = null;

                switch(i_t.attr("btn_util")){
                    case "cencle" :
                        content_data = row.content;
                        
                        break;

                    case "edit" :
                        const new_content=this_list_element.find(".edit_textarea_box textarea");

                        if(!new_content.val().trim()){
                            alert("내용을 입력해주세요.");

                            new_content.focus();

                            return;
                        }
                        if(new_content.val().length > 1000){
                            alert("1000자 이내로 작성해주세요.");

                            new_content.focus();

                            return;
                        }

                        await updateDoc(doc(db, "guest_book", this_id),{
                            content:new_content.val()
                        });

                        content_data=new_content.val();

                        alert("수정되었습니다.");

                        break;
                }

                this_list_element.find(".edit_textarea_box").remove();
                this_list_element.find(".list_head").after(`<p class="content">${content_data}</p>`);
            });
            break;
    }
});

let last_insert_time = 0;

$("#guest_book_insert").click(async function(){
    const now_time = Date.now();

    if(now_time-last_insert_time < 30000){
        const remain=Math.ceil((30000 - (now_time-last_insert_time)) / 1000);

        alert(remain + "초 후에 다시 작성할 수 있습니다.");

        return;
    }

    const my_name = $("input[name='my_name']"),
          my_password = $("input[name='my_password']"),
          my_content = $("textarea[name='my_content']");

    if(my_name.val() === ""){
        alert("이름, 닉네임이 작성 되지 않았습니다.");

        my_name.focus();

        return;
    }

    if(my_name.val().length > 20){
        alert("이름, 닉네임은 20자 이내로 작성해주세요.");

        my_name.val("").focus();

        return;
    }

    if(my_password.val() === ""){
        alert("비밀번호가 입력되지 않았습니다");

        my_password.focus();

        return;
    }

    if(my_password.val().length > 20){
        alert("비밀번호는 20자 이내로 입력 해주세요.");

        my_password.val("").focus();

        return;
    }

    if(my_content.val() === ""){
        alert("방명록이 작성 되지 않았습니다.");

        my_content.focus();

        return;
    }

    if(my_content.val().length > 1000){
        alert("1000자 이내로 작성해주세요.");

        my_content.focus();

        return;
    }

    const my_data_dic = {
        "name" : my_name.val(),
        "password" : my_password.val(),
        "content" : my_content.val(),
        "datetime" : format_datetime(),
        "order_time" : serverTimestamp()
    };

    try{
        const doc_ref = await addDoc(collection(db, "guest_book"), my_data_dic);

        alert("저장 완료");

        if(guest_book_list.find(".no_data").length > 0){
            guest_book_list.find(".no_data").remove();
        }

        const updated_total = await getCountFromServer(query(collection(db, "guest_book")));
        total_count = updated_total.data().count;

        guest_book_list.prepend(list_layer_fn(doc_ref.id, my_data_dic.name, my_data_dic.datetime, my_data_dic.content));
        $("#book_guest_count b").text(total_count);

        my_name.val("");
        my_password.val("");
        my_content.val("");
        last_insert_time = Date.now();
    }catch(e){
        console.error(e);

        alert("저장 실패: "+e.message);
    }
});

$(document).on("click", ".order_btn", async function(){
    const t = $(this);
    const this_data = t.data("order");

    t.addClass("on").siblings().removeClass("on");

    guest_book_list.empty();
    $("#guest_book_list_more").remove();

    order_by = this_data;

    guest_book_query = query(collection(db, "guest_book"), orderBy("order_time",order_by), limit(load_limit));
    guest_book_dic = await getDocs(guest_book_query);

    $.each(guest_book_dic.docs,function(index,value){
        const row = value.data();
        guest_book_list.append(list_layer_fn(value.id, row.name, row.datetime, row.content));
    });

    last_visible = guest_book_dic.docs[guest_book_dic.docs.length-1];
    loaded_count = guest_book_dic.docs.length;

    if(total_count > load_limit){
        guest_book_list.after(guest_book_list_more_layer);
    }
});

function list_layer_fn(a,b,c,d){
    const list_layer = `
        <li data-id="${a}">
            <div class="list_head">
                <div class="wri_data">
                    <span class="name"><strong>${b}</strong></span>
                    <span class="datetime">${c}</span>
                </div>
                <div class="btn_box">
                    <button class="util_btn" btn_util="edit_btn" type="button">수정</button>
                    <button class="util_btn" btn_util="remove_btn" type="button">삭제</button>
                </div>
            </div>
            <p class="content">${d}</p>
        </li>
    `;
    return list_layer;
}