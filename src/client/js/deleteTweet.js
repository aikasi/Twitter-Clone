// import axios from "axios";

// const deleteTweet = document.getElementById("jsDeleteTweet");

// const sendDeleteTweet = async (id) => {
//   const response = await axios({
//     url: `http://localhost:4001/api/${id}/delete`,
//     method: "POST",
//     data: {
//       id: id,
//     },
//   });
//   console.log(response);
//   if (response.status === 200) {
//     console.log("보내기 성공");
//   }
// };

// const handleDeleteTweet = async (e) => {
//   e.preventDefault();
//   let returnValue = confirm("삭제하겠습니까?");
//   if (returnValue) {
//     console.log("승락");
//     const tweetId = e.target.value;
//     sendDeleteTweet(tweetId);
//   }
//   if (!returnValue) {
//     console.log("거절");
//   }
// };

// function init() {
//   deleteTweet.addEventListener("click", handleDeleteTweet);
// }

// if (deleteTweet) {
//   init();
// }
