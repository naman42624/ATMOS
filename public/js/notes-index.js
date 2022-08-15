function getModalOfNote(event) {
  let last_char = event.target.id.split('-')[1]
  original = "mymodal";
  text_original ="txtarea";

  idd = original.concat("-" + last_char)
  text_idd = text_original.concat("-" + last_char)

  modal = document.getElementById(idd)

  modal.style.display = "block"



    window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      addText(last_char);
      saveDataToServer(event);
    }
  }
}


async function saveDataToServer(event){
  const last_char = event.target.id.split("-")[1];
  console.log(last_char);
  const title = document.getElementById("txtarea_"+last_char).value;
  console.log(title);
  const desc = document.getElementById("txtarea-"+last_char).value;
  console.log(desc);

  const url = "/notes/"+last_char;
  const result = await fetch({url},{
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({title,desc})
  });

  const response = result.JSON();
  if(response.redirect){
    location.assign(response.redirect);
  }

}




var count_bold = 0, count_italic = 0, count_underline = 0, count_color = 0;

  function feature1() {
    count_bold++;
    if(count_bold % 2 == 0) {
      document.getElementById(text_idd).style.fontWeight = "normal";
    }
    else {
      document.getElementById(text_idd).style.fontWeight = "900";
    }
  }

  function feature2() {
    count_italic++;
    if(count_italic % 2 == 0) {
      document.getElementById(text_idd).style.fontStyle = "normal"
    }
    else {
      document.getElementById(text_idd).style.fontStyle = "italic"
    }

  }

  function feature3() {
    count_underline++;
    if(count_underline % 2 == 0) {
      document.getElementById(text_idd).style.textDecoration = "none"
    }
    else {
      document.getElementById(text_idd).style.textDecoration = "underline"
    }
  }

  function feature4() {
    count_color++;
    if(count_color % 2 == 0) {
      document.getElementById(text_idd).style.color = "black"
    }
    else {
      document.getElementById(text_idd).style.color = "#E83A14"
    }
  }

function addText(last_char){
  original_id_1 = "txtarea"
  specific_idd_1 = original_id_1.concat("_" + last_char)
  original_id_2 = "title_upper_p";
  specific_idd_2 = original_id_2.concat("-" + last_char)

  specific_idd_3 = original_id_1.concat("-" + last_char)
  original_id_4 = "content_upper_p";
  specific_idd_4 = original_id_4.concat("-" + last_char)


  var title_upper_show = document.getElementById(specific_idd_1).value
  if(title_upper_show.length > 8) {
    document.getElementById(specific_idd_2).innerHTML = title_upper_show.slice(0, 8) + "..."
  }
  else {
    document.getElementById(specific_idd_2).innerHTML = title_upper_show
  }



  var title_upper_show_2 = document.getElementById(specific_idd_3).value
  if(title_upper_show_2.length > 70) {
    document.getElementById(specific_idd_4).innerHTML = title_upper_show_2.slice(0, 70) + "...";
  }
  else {
    document.getElementById(specific_idd_4).innerHTML = title_upper_show_2;
  }

}
