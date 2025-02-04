<template>
  <div>
    <!-- Ô input cho người dùng nhập LaTeX -->
    <textarea v-model="latexInput" rows="4" placeholder="Enter LaTeX formula here..."></textarea>

    <!-- Button chuyển đổi LaTeX thành ảnh -->
    <button @click="convertToImage">Convert to Image</button>

    <!-- Kết quả hiển thị -->
    <div v-if="image" v-html="image"></div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useHead } from "@unhead/vue";

export default defineComponent ({
  setup() {
    // Thêm MathJax vào <head>
    useHead({
      script: [
        {
          src: "https://cdn.mathjax.org/mathjax/latest/MathJax.js",
          async: false,
        },
      ],
    });

    const latexInput = ref(""); // Công thức LaTeX từ input
    const image = ref(null); // Ảnh PNG được sinh ra

    // Hàm chuyển đổi LaTeX thành PNG
    const tex2img = (formula, callback) => {
      if (!window.MathJax) {
        console.error("MathJax is not loaded");
        return;
      }

      window.MathJax.Hub.Queue(function () {
        const wrapper = window.MathJax.HTML.Element("span", {}, formula);
        window.MathJax.Hub.Typeset(wrapper, function () {
          const svg = wrapper.getElementsByTagName("svg")[0];
          svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          const imgElement = new Image();
          imgElement.src =
            "data:image/svg+xml;base64," +
            window.btoa(unescape(encodeURIComponent(svg.outerHTML)));
          imgElement.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;
            const context = canvas.getContext("2d");
            context.drawImage(imgElement, 0, 0);
            const img =
              '<img src="' +
              canvas.toDataURL("image/png") +
              '" alt="Math formula"/>';
            callback(img);
          };
        });
      });
    };

    // Hàm xử lý khi người dùng nhấn "Convert to Image"
    const convertToImage = () => {
      if (!latexInput.value.trim()) {
        alert("Please enter a LaTeX formula.");
        return;
      }

      tex2img(`\\(${latexInput.value}\\)`, (output) => {
        image.value = output; // Gán kết quả vào biến hiển thị
      });
    };

    // Khởi tạo MathJax
    onMounted(() => {
      window.MathJax = {
        jax: ["input/TeX", "output/SVG"],
        extensions: ["tex2jax.js"],
        SVG: {
          useGlobalCache: false,
        },
      };

      if (window.MathJax) {
        window.MathJax.Hub.Config({
          showProcessingMessages: false,
          messageStyle: "none",
          skipStartupTypeset: true,
        });
      }
    });

    return {
      latexInput,
      image,
      convertToImage,
    };
  },
});
</script>

<style>
textarea {
  width: 100%;
  margin-bottom: 10px;
}
button {
  margin-bottom: 10px;
}
</style>
