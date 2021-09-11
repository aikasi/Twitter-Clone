import axios from "axios";

const addLikeForm = document.querySelectorAll("#jsAddLike");

const sendLike = async (like, user) => {
  console.log(`/api/${like}/like`);
  const response = await axios({
    url: `http://localhost:4001/api/${like}/like`,
    method: "POST",
    data: {
      tweetId: like,
      user,
    },
  });
  console.log(response);
  if (response.status === 200) {
    console.log("보내기 성공");
  }
};

const sendLikeCancel = async (like, user) => {
  const response = await axios({
    url: `http://localhost:4001/api/${like}/like/cancel`,
    method: "POST",
    data: {
      tweetId: like,
      user,
    },
  });
  console.log(response);
  if (response.status === 200) {
    console.log("보내기 성공");
  }
};

const handleLikeClick = async (event) => {
  event.preventDefault();
  const tweetId = event.target.value;
  let likeList = event.target.classList;
  const [user] = Array(likeList[0]);
  console.log(user);
  let result = likeList.toggle("unlike");
  if (result) {
    event.target.innerText = "좋아요 취소";
    console.log("A");
    sendLike(tweetId, user);
  } else {
    event.target.innerText = "좋아요";
    console.log("B");
    sendLikeCancel(tweetId, user);
  }
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
