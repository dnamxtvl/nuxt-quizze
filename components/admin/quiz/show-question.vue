<template>
    <el-dialog v-model="showModalCreateOrUpdateEditQuestion" close-icon="false" top="1vh"
        :close-on-click-modal="false" :title="isUpdate ? 'Cập nhật' : 'Tạo mới'" width="80%">
        <div class="d-flex justify-content-center">
            <span class="text-primary mt-2 fs-6">VD:</span>
            <math-field readonly style="width: 110px; font-size:1rem; border: none">
                x=\frac{\sqrt{b^2-4ac}}{2a}
            </math-field>
            <math-field id="math-field" ref="mathfield" style="width: 250px; font-size:1.3rem; margin-right: 10px">
            </math-field>
            <span class="cursor-pointer text-primary mt-2" @click="getLatex">
                <RiAddCircleFill size="25" class-name="me-1" />
            </span>
        </div>
        <div v-for="(error, index) in errorMessageUpdateQuestions" :key="index" class="text-danger"
            v-show="errorMessageUpdateQuestions.length > 0">
            <el-alert :title="error" type="error" :closable="false" class="mb-1 mt-1" />
        </div>
        <label for="inputPassword6" class="col-form-label fw-bold">Câu hỏi</label>
        <ClientOnly>
            <QuillEditor ref="quill" theme="snow" v-model:content="currentQuestion.title" contentType="html" :options="editorOptions"/>
        </ClientOnly>
        <div class="container mt-2 d-flex justify-content-center">
            <div class="upload-container" ref="loadingImageContainer" @click.stop="triggerUploadImage">
                <img :src="currentQuestion.image" alt="Image Preview" v-if="currentQuestion.image">
                <span class="cursor-pointer bottom-0 end-0 position-absolute me-2 mb-2" @click.stop="clearImage" v-if="currentQuestion.image">
                    <RiDeleteBin2Fill size="25" class="text-danger cursor-pointer" />
                </span>
                <input
                    type="file"
                    id="imageUpload"
                    ref="imageInput"
                    style="display: none"
                    accept="image/png, image/jpeg, image/gif, image/jpg"
                    @change="onImageChange"
                />
                <label class="cursor-pointer">
                <div id="placeholder" class="text-center" v-if="!currentQuestion.image">
                    <RiAddCircleFill size="25" class="text-primary" />
                    <p>Upload ảnh {{ '<' }} 2MB</p>
                </div>
                </label>
            </div>
        </div>
        <div class="row mt-1">
            <span class="text-primary">
                <label for="inputPassword6" class="col-form-label fw-bold">Câu trả lời</label>
                <span v-if="currentQuestion.answers.length < maxAnswerOFQuestion" class="cursor-pointer"
                    @click="addAnswerOfQuestion">
                    <RiAddCircleLine size="18" class="mb-1 ms-1" />
                </span>
            </span>
            <div class="row">
                <div v-for="(checkbox, index) in currentQuestion.answers" :key="index"
                class="d-flex form-check mb-3 col-md-6">
                    <input class="form-check-input mt-2 ms-1 me-1" type="checkbox" :id="'checkbox-' + index"
                    v-model="checkbox.is_correct">
                <input class="form-control form-check-label ms-1" :for="'checkbox-' + index"
                    v-model="checkbox.answer">
                <span v-if="currentQuestion.answers.length > minAnswerOFQuestion"
                    class="text-danger cursor-pointer mt-2">
                    <RiCloseLine size="18" class="mb-1 ms-1" @click="removeAnswerOfQuestion(checkbox.id)" />
                </span>
                </div>
            </div>
        </div>
        <template #footer class="pt-0">
            <div class="dialog-footer row">
                <div class="d-flex justify-content-start col-md-6">
                    <input type="number" v-model="currentQuestion.time_reply" class="form-control time-reply-input" min="10" max="60"/>
                    <span class="mt-2 ms-1">giây</span>
                </div>
                <div class="d-flex justify-content-end col-md-6">
                    <el-button @click="closeModal">
                        <RiCloseLine size="18" />
                        Hủy
                    </el-button>
                    <el-button type="primary" @click="updateQuestion">
                        <RiEditFill size="18" />
                        Xác nhận
                    </el-button>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import { RiEditFill, RiDeleteBin2Fill, RiCheckFill, RiAddCircleFill, RiCloseLine, RiAddCircleLine } from "@remixicon/vue";
import { QuillEditor } from '@vueup/vue-quill';
import { RULES_VALIDATION } from "~/constants/application";
import { RoomSetting } from "~/constants/room";
import { ElNotification, ElLoading } from "element-plus";
import { defineExpose } from "vue";
import api from "~/api/axios";
import uuid4 from "uuid4";
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export interface Answer {
    id: number;
    answer: string;
    is_correct: boolean;
    created_at: string;
}

export interface ItemQuestion {
    id: string;
    title: string;
    quizze_id: string;
    image?: string|null;
    time_reply?: number|null;
    answers: Array<Answer>;
    created_at: string;
}

export default defineComponent({
    name: "ShowQuestion",
    components: {
        RiEditFill,
        RiDeleteBin2Fill,
        RiCheckFill,
        RiAddCircleFill,
        RiCloseLine,
        QuillEditor,
        RiAddCircleLine,
    },
    setup(props, { emit }) {
        const showModalCreateOrUpdateEditQuestion = ref<boolean>(false);
        const errorMessageUpdateQuestions = ref<string[]>([]);
        const isUpdate = ref<boolean>(false);
        const currentQuestion = ref<ItemQuestion>({
            id: '',
            title: '',
            quizze_id: '',
            time_reply: RoomSetting.TIME_REPLY,
            image: null,
            answers: [],
            created_at: ''
        });
        const mathfield = ref(null);
        const latexInput = ref("");
        const image = ref(null);
        const quill = ref(null);
        const maxAnswerOFQuestion = RULES_VALIDATION.QUESTION.MAX_ANSWER;
        const minAnswerOFQuestion = RULES_VALIDATION.QUESTION.MIN_ANSWER;
        const imageInput = ref(null);
        const loadingImageContainer = ref(null);

        const getLatex = async () => {
            latexInput.value = mathfield.value?.getValue();
            await convertToImage();
            const quillEditor = quill.value?.getQuill();

            if (!quillEditor || !image.value) return;
            quillEditor.focus();

            const range = quillEditor.getSelection();
            if (range) {
                const spanWrapper = `${image.value}`;
                quillEditor.clipboard.dangerouslyPasteHTML(range.index, spanWrapper);
                mathfield.value?.setValue('');
            } else {
                ElNotification({title: "Error", message: "Đã xảy ra lỗi!", type: "error"});
            }
        };

        const convertToImage = async () => {
            if (!latexInput.value.trim()) {
                ElNotification({title: "Error", message: "Vui lòng nhập ký tự toán học!", type: "error"});
                return;
            }

            try {
                image.value = await tex2img(`\\(${latexInput.value}\\)`);
            } catch (error) {
                ElNotification({title: "Error", message: "Đã xảy ra lỗi!", type: "error"});
            }
        };

        const tex2img = (formula: string) => {
            return new Promise((resolve, reject) => {
                if (!window.MathJax || !window.MathJax.Hub) {
                    return reject("MathJax is not loaded yet.");
                }

                window.MathJax.Hub.Queue(function () {
                    try {
                        const wrapper = window.MathJax.HTML.Element("span", {}, formula);
                        window.MathJax.Hub.Typeset(wrapper, function () {
                        const svg = wrapper.getElementsByTagName("svg")[0];
                        if (!svg) {
                            return reject("Failed to generate SVG.");
                        }
                        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                        const imgElement = new Image();
                        let imgId = "img-mathlive-" + uuid4() + Date.now(); 
                        imgElement.id = imgId;
                        imgElement.className = "img-mathlive";
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
                            '<span id="' + imgId + '" class="img-mathlive"><img src="' +
                            canvas.toDataURL("image/png") +
                            '" alt="Math formula"/></span>';
                            resolve(img);
                        };
                        });
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        };

        const editorOptions = {
            theme: "snow",
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    [{ align: [] }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ color: [] }],
                ],
            },
        };

        const handleAddQuestion = () => {
            isUpdate.value = false;
            showModalCreateOrUpdateEditQuestion.value = true;
            errorMessageUpdateQuestions.value = [];
            currentQuestion.value = {
                id: '',
                title: '',
                quizze_id: '',
                time_reply: RoomSetting.TIME_REPLY,
                answers: [],
                created_at: ''
            };

            if (quill.value) {
                quill.value.setHTML('');
            }

            for (let i = 0; i < RULES_VALIDATION.QUESTION.MAX_ANSWER; i++) {
                addAnswerOfQuestion();
            }

            if (imageInput.value) {
                imageInput.value.value = '';
            }
        }

        const handleEditQuestion = (item: ItemQuestion) => {
            isUpdate.value = true;
            showModalCreateOrUpdateEditQuestion.value = true;
            errorMessageUpdateQuestions.value = [];
            currentQuestion.value = item;
            if (imageInput.value) {
                imageInput.value.value = '';
            }
        }

        defineExpose({
            handleAddQuestion,
            handleEditQuestion,
        });

        const validateQuestionUpdateOrCreate = () => {
            const validator = useValidator();
            let isPassvalidate: boolean = true;
            let errorMessagesValidate: string[] = [];
            if (currentQuestion.value.answers.length < minAnswerOFQuestion || currentQuestion.value.answers.length > maxAnswerOFQuestion) {
                errorMessagesValidate.push(`Câu hỏi phải có 2 đến 4 câu trả lời!`);
                isPassvalidate = false;
            }

            let counAnswerCorrect = currentQuestion.value.answers.filter((answer: Answer) => answer.is_correct).length;
            if (counAnswerCorrect == 0) {
                errorMessagesValidate.push(`Câu hỏi phải có ít nhất 1 đáp án đúng!`);
                isPassvalidate = false;
            }

            if (!currentQuestion.value.time_reply || currentQuestion.value.time_reply < RoomSetting.MIN_TIME_REPLY || currentQuestion.value.time_reply > RoomSetting.MAX_TIME_REPLY) {
                errorMessagesValidate.push(`Thời gian trả lời phải từ ${RoomSetting.MIN_TIME_REPLY} đến ${RoomSetting.MAX_TIME_REPLY} giây!`);
                isPassvalidate = false;
            }

            let requiredQuestionTitle = isContentEmpty(currentQuestion.value.title.trim());
            currentQuestion.value.title = currentQuestion.value.title.trim().replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, '');
            if (requiredQuestionTitle == true) {
                errorMessagesValidate.push('Bạn chưa nhập câu hỏi!');
                isPassvalidate = false;
            }

            let defaultStringAnwser = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            currentQuestion.value.answers.forEach((answer: Answer, index: number) => {
                let requiredAnswer = validator.required(answer.answer.trim(), "Đáp án " + defaultStringAnwser[index]);
                let isLengthAnswer = validator.isLength(
                    answer.answer.trim(),
                    "Đáp án " + defaultStringAnwser[index],
                    RULES_VALIDATION.QUESTION.ANSWER.MIN_LENGTH,
                    RULES_VALIDATION.QUESTION.ANSWER.MAX_LENGTH,
                    true,
                );
                if (requiredAnswer != true) {
                    errorMessagesValidate.push(requiredAnswer);
                    isPassvalidate = false;
                }

                if (isLengthAnswer != true) {
                    errorMessagesValidate.push(isLengthAnswer);
                    isPassvalidate = false;
                }
            })

            errorMessageUpdateQuestions.value = errorMessagesValidate;

            return isPassvalidate;
        }

        const isContentEmpty = (content: string) => {
            const cleanContent = content.replace(/<\/?[^>]+(>|$)|\s|<br>/g, '');
            return cleanContent.length === 0;
        }

        const triggerUploadImage = () => {
            if (imageInput.value) {
                imageInput.value.click();
            }
        }

        const addAnswerOfQuestion = () => {
            currentQuestion.value.answers.push({
                id: currentQuestion.value.answers.length > 0 ? currentQuestion.value.answers[currentQuestion.value.answers.length - 1].id + 1 : 1,
                answer: '',
                is_correct: false,
                created_at: '',
            });
        }

        const onImageChange = async (e: InputFileEvent) => {
            const image = e.target.files ? e.target.files[0] : null;
            let isPassValidate: boolean = true;
            if (image) {
                if (image.size > RULES_VALIDATION.AVATAR.MAX_SIZE_UPLOAD) {
                isPassValidate = false;
                    ElNotification({
                        title: "Error",
                        message: `Ảnh phải có dung lượng nhỏ hơn ${RULES_VALIDATION.AVATAR.MAX_SIZE_UPLOAD / 1000}KB`,
                        type: "error",
                    });
                }
            }

            if (isPassValidate && image) {
                const formData = new FormData();
                formData.append("image", image as File);
                const loadingInstance = ElLoading.service({
                    target: loadingImageContainer.value,
                    text: 'Đang tải lên...',
                    background: 'rgba(255, 255, 255, 0.8)',
                });

                await api.user.uploadImage(
                    formData,
                    (res: any) => {
                        currentQuestion.value.image = res.path;
                    },
                    (err: any) => {
                        ElNotification({
                            title: "Error",
                            message: err.error.shift(),
                            type: "error",
                        });
                    }
                )

                loadingInstance.close();
            }
        }

        const updateQuestion = async () => {
            const resultValidate = validateQuestionUpdateOrCreate();
            if (!resultValidate) {
                return;
            }

            let currentQuestionValue = currentQuestion.value;
            let isUpdateValue = isUpdate.value;

            emit('update-question', {currentQuestionValue, isUpdateValue});

            showModalCreateOrUpdateEditQuestion.value = false;
        }

        const clearImage = () => {
            currentQuestion.value.image = null;
            if (imageInput.value) imageInput.value.value = "";
        }

        const closeModal = () => {
            showModalCreateOrUpdateEditQuestion.value = false;
            isUpdate.value = false;
            emit('close-modal');
        }

        const removeAnswerOfQuestion = (answerId: number) => {
            currentQuestion.value.answers = currentQuestion.value.answers.filter((answer: Answer) => answer.id != answerId);
        }

        return {
            showModalCreateOrUpdateEditQuestion,
            errorMessageUpdateQuestions,
            isUpdate,
            currentQuestion,
            editorOptions,
            mathfield,
            maxAnswerOFQuestion,
            minAnswerOFQuestion,
            quill,
            imageInput,
            loadingImageContainer,
            addAnswerOfQuestion,
            onImageChange,
            triggerUploadImage,
            updateQuestion,
            clearImage,
            getLatex,
            handleAddQuestion,
            handleEditQuestion,
            closeModal,
            removeAnswerOfQuestion,
        };
    },
});
</script>
<style scoped>
:deep(.ql-editor) {
    min-height: 50px;
}
:deep(.ql-toolbar.ql-snow) {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
:deep(.ql-container.ql-snow) {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.ML__keyboard {
    z-index: 9999999999999999 !important; /* Đảm bảo z-index cao và ưu tiên */
    position: absolute; /* Hoặc `absolute` tùy vào cấu trúc */
}

body {
    --keyboard-zindex: 9999 !important;
}

.el-dialog__footer {
    padding-top: 0 !important;
}

.upload-container {
    position: relative;
    width: 300px;
    height: 200px;
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

.time-reply-input {
    border-top: none;
    border-left: none;
    width: 70px;
}
</style>
