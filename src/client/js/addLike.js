import axios from "axios";

const addLikeForm = document.querySelectorAll("#jsAddLike");

const sendLike = async (like) => {
  console.log(`/api/${like}/like`);
  const response = await axios({
    url: `http://localhost:4001/api/${like}/like`,
    method: "POST",
    data: {
      tweetId: like,
    },
  });
  console.log(response);
  if (response.status === 200) {
    console.log("보내기 성공");
  }
};

const handleLikeClick = (event) => {
  event.preventDefault();
  const tweetId = event.target.value;
  sendLike(tweetId);
};

function init() {
  for (let i = 0; i < addLikeForm.length; i++) {
    let addLike = addLikeForm.item(i);
    addLike.addEventListener("click", handleLikeClick);
  }
}

if (addLikeForm) {
  init();
}
