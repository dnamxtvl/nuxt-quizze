<template>
    <div v-for="(item, index) in questionArray"
        class="question-preview-content border rounded rounded-3 pl-2 mb-3">
        <div class="d-flex justify-content-between align-items-center">
            <div class="col-md-9 d-flex justify-content-start mt-2">
                <span
                    class="text-black fw-normal fs-5 pt-2 ps-4 pe-2 text-start font-bold">
                    {{ (index + 1) + ". " }}
                </span>
                <div class="text-black fw-normal fs-5 pt-2 text-start font-bold" v-html="item.title"></div>
                <span
                    class="text-primary fw-normal fs-5 pt-2 ps-4 pe-2 text-start font-bold">
                    {{ '(' + item.time_reply + "s" + ')' }}
                </span>
            </div>
            <div class="col-md-3 d-flex justify-content-end mt-2 pe-3">
                <span @click="handleEditQuestion(item, index)"
                    class="text-primary text-white me-2 mt-2 cursor-pointer">
                    <RiEditFill size="18" class="mb-1" />
                </span>
                <span @click="handleRemoveQuestion(index)"
                    class="text-danger me-2 mt-2 cursor-pointer">
                    <RiDeleteBin2Fill size="18" class="mb-1" />
                </span>
            </div>
        </div>
        <hr></hr>
        <div
            class="d-flex justify-content-between question-answer-review px-4 pt-2 mb-2">
            <div class="col-xl-9 col-lg-9 col-md-8 col-sm-6">
                <div class="form-check" v-for="(answer, index) in item.answers">
                    <RiCheckFill :color="answer.is_correct ? 'green' : 'red'" />
                    <label class="form-check-label ms-2" for="flexCheckDefault">
                        {{ answer.answer }}
                    </label>
                </div>
            </div>
            <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 d-flex justify-content-end" v-if="item.image">
                <div class="upload-container image-review-container">
                    <img :src="item.image" alt="Image Preview" v-if="item.image">
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { RiEditFill, RiDeleteBin2Fill, RiCheckFill } from "@remixicon/vue";

interface ItemAnswer {
    answer: string;
    is_correct: boolean;
}

interface ItemQuestion {
    title: string;
    image?: string|null;
    time_reply?: number|null;
    answers: ItemAnswer[]
}

export default defineComponent({
    name: "Question",
    components: {
        RiEditFill,
        RiDeleteBin2Fill,
        RiCheckFill
    },
    props: {
        questionArray: {
            type: Array as PropType<ItemQuestion[]>,
            required: true,
        },
    },
    setup(props, { emit }) {

        const handleEditQuestion = (item: ItemQuestion, index: number) => {
            emit("edit-question", { item, index });
        };

        const handleRemoveQuestion = (index: number) => {
            emit("remove-question", index);
        };

        return {
            handleEditQuestion,
            handleRemoveQuestion,
        };
    },
});
</script>
<style scoped>
.image-review-container {
    height: 100px;
    width: 150px;
}

.upload-container {
    position: relative;
    border: 2px dashed #ddd;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    cursor: pointer;
}

.upload-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
}

.upload-container .delete-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.upload-container:hover {
    background-color: #e9ecef;
}

.upload-container input {
    display: none;
}
</style>
