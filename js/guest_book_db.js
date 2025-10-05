// Firebase SDK 라이브러리 가져오기
import{
    initializeApp
}from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

import{
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
    deleteDoc
}from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyDCTjFYPvh6kpZamGxWy8i3MLXCQlEZzfc",
    authDomain: "kingyulim-project.firebaseapp.com",
    projectId: "kingyulim-project",
    storageBucket: "kingyulim-project.firebasestorage.app",
    messagingSenderId: "983651940781",
    appId: "1:983651940781:web:7cdc2f47e6b23a7a3f0924",
    measurementId: "G-2M5TW30KYB"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const guest_book_list = $("#guest_book_article .list_wrap");

$("#guest_book_insert").click(async function(){
    const my_name = $("input[name='my_name']"),
          my_password = $("input[name='my_password']"),
          my_content = $("textarea[name='my_content']");

    if(my_name.val() === ""){
        alert("이름, 닉네임이 작성 되지 않았습니다.");
        return;
    }

    if(my_password.val() === ""){
        alert("비밀번호가 입력되지 않았습니다");
        return;
    }

    if(my_content.val() === ""){
        alert("방명록이 작성 되지 않았습니다.");
        return;
    }

    const my_data_dic = {
        "name" : my_name.val(),
        "password" : my_password.val(),
        "content" : my_content.val(),
        "datetime" : format_datetime()
    };

    try{
        const doc_ref = await addDoc(collection(db, "guest_book"), my_data_dic);

        alert("저장 완료");

        if(guest_book_list.find(".no_data").length > 0){
            guest_book_list.find(".no_data").remove();
        }

        guest_book_list.prepend(list_layer_fn(doc_ref.id, my_data_dic.name, my_data_dic.datetime, my_data_dic.content));

        my_name.val("");
        my_password.val("");
        my_content.val("");
    }catch(e){
        console.error(e);

        alert("저장 실패: " + e.message);

        return;
    }
});

const guest_book_query = query(collection(db, "guest_book"), orderBy("datetime", "desc")),
      guest_book_dic = await getDocs(guest_book_query);

if(guest_book_dic.docs.length > 0){
    $.each(guest_book_dic.docs, function(index, value){
        let row = value.data();
        
        guest_book_list.append(list_layer_fn(value.id, row.name, row.datetime, row.content));
    });
}else{
    guest_book_list.append("<li class=\"no_data\">작성된 방명록이 없습니다.</li>");
}

guest_book_list.on("click", ".util_btn", async function() {
    const t = $(this);
    const this_id = t.closest("li[data-id]").data("id");

    const get_this_list = await getDoc(doc(db, "guest_book", this_id));

    if(!get_this_list.exists()){
        alert("존재하지 않는 데이터입니다.");

        return;
    }

    const password_prompt = prompt("비밀번호를 입력해주세요.");

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

            if(guest_book_list.find("li[data-id]").length === 0 && guest_book_list.find(".no_data").length === 0) {
                guest_book_list.append('<li class="no_data">작성된 방명록이 없습니다.</li>');
            }

            break;

        case "edit_btn" :
            const this_list_element = $("li[data-id='" + this_id + "']");
            this_list_element.find(".content").remove();

            const edit_textarea = `
                <div class="edit_textarea_box">
                    <textarea placeholder="수정할 내용을 작성해주세요.">${row.content}</textarea>
                    <div class="btn_box">
                        <button class="ed_util_btn df_btn" btn_util="cencle" type="button">취소</button>
                        <button class="ed_util_btn df_btn" btn_util="edit" type="button">수정</button>
                    </div>
                </div>
            `;

            this_list_element.find(".list_head").after(edit_textarea);

            this_list_element.find(".edit_textarea_box").off("click").on("click", ".ed_util_btn", async function() {
                    const i_t = $(this);
                    let content_data = null;

                    switch(i_t.attr("btn_util")){
                        case "cencle" :
                            content_data = row.content;

                            break;

                        case "edit" : 
                            const new_content = this_list_element.find(".edit_textarea_box textarea").val().trim();

                            if(!new_content) {
                                alert("내용을 입력해주세요.");

                                return;
                            }

                            await updateDoc(doc(db, "guest_book", this_id), {
                                content: new_content
                            });

                            content_data = new_content;

                            alert("수정되었습니다.");

                            break;
                    }

                    this_list_element.find(".edit_textarea_box").remove();
                    this_list_element .find(".list_head").after(`<p class="content">${content_data}</p>`);
                });

            break;
    }
});

function list_layer_fn(a, b, c, d){
    const list_layer = `
        <li data-id="${a}">
            <div class="list_head">
                <div class="wri_data">
                    <span class="name">
                        <strong>${b}</strong>
                    </span>
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