<template>
    <div class="row ms-4 me-4">
        <div class="app-email card h-100-vh">
            <div class="row g-0 h-100-vh">
                <el-dialog v-model="showModalCreateOrUpdateEditQuestion" close-icon="false"
                    :close-on-click-modal="false" :title="isUpdate ? 'Cập nhật' : 'Tạo mới'" width="1200" align-center>
                    <div v-for="(error, index) in errorMessageUpdateQuestions" :key="index" class="text-danger"
                        v-show="errorMessageUpdateQuestions.length > 0">
                        <el-alert :title="error" type="error" :closable="false" class="mb-1 mt-1" />
                    </div>
                    <label for="inputPassword6" class="col-form-label fw-bold">Câu hỏi</label>
                    <input type="text" class="form-control" v-model="currentQuestion.title" />
                    <div class="row mt-3">
                        <span class="text-primary">
                            <label for="inputPassword6" class="col-form-label fw-bold">Câu trả lời</label>
                            <span v-if="currentQuestion.answers.length < maxAnswerOFQuestion" class="cursor-pointer"
                                @click="addAnswerOfQuestion">
                                <RiAddCircleLine size="18" class="mb-1 ms-1" />
                            </span>
                        </span>
                        <div v-for="(checkbox, index) in currentQuestion.answers" :key="index"
                            class="d-flex form-check mb-3 ms-2 pe-4">
                            <input class="form-check-input mt-2" type="checkbox" :id="'checkbox-' + index"
                                v-model="checkbox.is_correct">
                            <input class="form-control form-check-label ms-1" :for="'checkbox-' + index"
                                v-model="checkbox.answer">
                            <span v-if="currentQuestion.answers.length > minAnswerOFQuestion"
                                class="text-danger cursor-pointer mt-2">
                                <RiCloseLine size="18" class="mb-1 ms-1" @click="removeAnswerOfQuestion(checkbox.id)" />
                            </span>
                        </div>
                    </div>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="closeModalCreateOrUpdate">
                                <RiCloseLine size="18" />
                                Hủy
                            </el-button>
                            <el-button type="primary" @click="updateQuestion">
                                <RiEditFill size="18" />
                                Xác nhận
                            </el-button>
                        </div>
                    </template>
                </el-dialog>
                <!-- Create Quizz -->
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <div class="row d-flex align-items-center ms-1 me-1 mb-1" v-if="errorMessagesUpload.length > 0">
                        <div class="col-md-6">
                            <div class="text-danger" v-for="(error, index) in errorMessagesUpload" :key="index">* {{
                                error }}</div>
                        </div>
                    </div>
                    <div class="row d-flex align-items-center ms-1 me-1 mb-1"
                        v-if="errorMessagesPasteListQuestion.length > 0">
                        <div class="col-md-6">
                            <div class="text-danger" v-for="(error, index) in errorMessagesPasteListQuestion"
                                :key="index">* {{ error }}</div>
                        </div>
                    </div>
                    <div class="row d-flex align-items-center ms-1 me-1">
                        <div class="col-md-6 mb-3">
                            <label for="exampleInputEmail1" class="form-label fw-600 fs-5">Tiêu đề <span
                                    class="text-danger">*</span></label>
                            <input v-model="title" type="text" class="form-control col-md-6"
                                placeholder="Câu hỏi tin học">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="exampleInputEmail1" class="form-label fw-600 fs-5">Chủ đề <span
                                    class="text-danger">*</span></label>
                            <select v-model="categoryId" type="text" class="form-control col-md-6"
                                placeholder="Câu hỏi tin học">
                                <option value="">Chọn chủ đề</option>
                                <option :value="item.id" v-if="listCategory.length > 0"
                                    v-for="(item,index) in listCategory" :key="index">
                                    {{ item.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <el-tab-pane label="Tạo câu hỏi" name="first">
                        <div class="flex flex-col w-full gap-6">
                            <button @click="handleAddQuestion" class="btn btn-primary me-3 mt-3 mb-2 ps-2 ms-3">
                                <RiAddCircleFill size="18"/> Tạo câu hỏi
                            </button>
                            <ClientOnly>
                                <mathToMage />
                                <p>FAFA</p><math-field read-only style="display:inline-block; border: none">\sqrt2</math-field>
                                <QuillEditor theme="snow" v-model:content="latexInput" contentType="html"/>
                            </ClientOnly>
                            <math-field ref="mathfield" style="width: 20%; height: 50px;"></math-field>
                            <button @click="getLatex">Get LaTeX</button>
                            <div class="players-card main-card">
                                <div class="row pt-2 rounded rounded-5">
                                    <div class="col-lg-12 px-4 mb-2">
                                        <div v-for="(item, index) in questionArray"
                                            class="question-preview-content border rounded rounded-3 pl-2 mb-3">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div class="col-md-9 d-flex justify-content-start mt-2">
                                                    <span
                                                        class="text-black fw-normal fs-5 pt-2 px-4 text-start font-bold">
                                                        {{ (index + 1) + ". " + item.title }}
                                                    </span>
                                                </div>
                                                <div class="col-md-3 d-flex justify-content-end mt-2">
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
                                            <hr>
                                            </hr>
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <form class="p-3" @submit="createQuizz" >
                                <button v-if="questionArray.length > 0" type="submit" class="btn btn-primary  float-end">
                                    <RiAddCircleFill size="18" /> Tạo quizz
                                </button>
                            </form>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Import" name="second">
                        <div class="flex flex-col w-full gap-6 rounded-pill">
                            <form @submit="uploadFileListQuestion"
                                class="container d-flex row justify-content-center align-items-center mt-4 rounded-pill"
                                enctype="multipart/form-data">
                                <div class="card shadow-lg p-4">
                                    <div class="drag-file-area text-center border border-primary rounded p-4">
                                        <span v-if="!fileListQuestion"
                                            class="material-icons-outlined upload-icon fs-1 text-primary"> Tải lên
                                            file csv </span>
                                        <h3 v-if="!fileListQuestion" class="dynamic-message fw-medium">với dung lượng <
                                            5mb</h3>
                                            <h3 v-if="fileListQuestion"
                                                class="dynamic-message fw-medium text-primary rounded-pill">{{
                                                fileListQuestion.name }}</h3>
                                            <label class="d-block">
                                                <span class="browse-files">
                                                    <input @change="onFileChange" type="file"
                                                        class="d-none default-file-input" />
                                                    <span class="text-primary fw-bold">Chọn file</span>
                                                    từ thiết bị của bạn
                                                </span>
                                            </label>
                                    </div>
                                    <div class="alert alert-danger d-none cannot-upload-message" role="alert">
                                        <span class="material-icons-outlined">error</span> Please select a file first
                                        <span class="material-icons-outlined cancel-alert-button ms-2">cancel</span>
                                    </div>
                                    <div
                                        class="file-block d-none p-3 mt-3 bg-primary text-white rounded d-flex justify-content-between">
                                        <div class="file-info">
                                            <span class="material-icons-outlined file-icon">description</span>
                                            <span class="file-name"></span> | <span class="file-size"></span>
                                        </div>
                                        <span class="material-icons remove-file-icon">delete</span>
                                    </div>
                                    <div class="footer-form row d-flex justify-content-center">
                                        <div class="col-md-4">
                                            <a :href="useRuntimeConfig().public.BACKEND_URL + 'format_import_question.csv'"
                                                class="btn btn-success w-100 mt-3 upload-button text-white">
                                                <RiDownloadLine size="18" class="me-1" />Tải xuống format
                                            </a>
                                        </div>
                                        <div class="col-md-4">
                                            <button type="submit" class="btn btn-primary w-100 mt-3 upload-button">
                                                <RiUploadLine size="17" class="me-1 mb-1" />Upload
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <!-- End Create Quizz -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { Answer, ErrorResponse, ItemQuestion as ItemQuestionDetail, Category } from "~/constants/type";
import { ElNotification } from "element-plus";
import api from "~/api/axios";
import type { TabsPaneContext } from 'element-plus'
import { RiAddCircleFill, RiUploadLine, RiDownloadLine, RiCloseLine, RiAddCircleLine, RiEditFill, RiDeleteBin2Fill, RiCheckFill } from "@remixicon/vue";
import { RULES_VALIDATION } from "~/constants/application";
import Papa from 'papaparse';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useHead } from "@unhead/vue";

definePageMeta({
    layout: "admin-dashboard",
})

interface ItemAnswer {
    answer: string;
    is_correct: boolean;
}

interface ItemQuestion {
    title: string;
    answers: ItemAnswer[]
}

declare global {
  interface Window {
    MathJax: any;
  }
}

export default defineComponent({
    components: {
        RiAddCircleFill,
        RiUploadLine,
        RiDownloadLine,
        RiCloseLine,
        RiAddCircleLine,
        RiEditFill,
        RiDeleteBin2Fill,
        RiCheckFill,
        QuillEditor,
    },
    setup() {
        useHead({
      script: [
        {
          src: "https://cdn.mathjax.org/mathjax/latest/MathJax.js",
          async: false,
        },
      ],
    });
        const activeName = ref<string>('first')
        const listQuizzText = ref<string>('');
        const questionArray = ref<Array<ItemQuestion>>([]);;
        const title = ref<string>('');
        const categoryId = ref<number | "">("");
        const fileListQuestion = ref<File | null>(null);
        const errorMessagesUpload = ref<Array<string>>([]);
        const errorMessagesPasteListQuestion = ref<Array<string>>([]);
        const contentOfFile = ref<Array<ItemQuestion>>([]);
        const isValidQuestions = ref<boolean>(false);
        const listCategory = ref<Array<Category>>([]);
        const errorMessageUpdateQuestions = ref<string[]>([]);
        const isUpdate = ref<boolean>(false);
        const showModalDeleteQuestion = ref<boolean>(false);
        const currentQuestionIdDelete = ref<string>('');
        const currentQuestion = ref<ItemQuestionDetail>({
            id: '',
            title: '',
            quizze_id: '',
            answers: [],
            created_at: ''
        });
        const currentIndexUpdate = ref<number>(0);
        const maxAnswerOFQuestion = RULES_VALIDATION.QUESTION.MAX_ANSWER;
        const minAnswerOFQuestion = RULES_VALIDATION.QUESTION.MIN_ANSWER;
        const showModalCreateOrUpdateEditQuestion = ref<boolean>(false);
        const mathfield = ref(null);

        const getLatex = () => {
            latexInput.value = mathfield.value?.getValue();
            convertToImage();
        };

        const handleClick = (tab: TabsPaneContext, event: Event) => {
            console.log(tab, event)
        }

        useHead({
            script: [
                {
                    src: "https://cdn.mathjax.org/mathjax/latest/MathJax.js",
                    async: false,
                },
            ],
        });

        const getCatogory = async () => {
            await api.quizze.listCategory((res: any) => {
                listCategory.value = res;
            }, (err: ErrorResponse) => {
                ElNotification({title: "Error", message: err.error.shift(), type: "error"});
            })
        }

        const submitQuestions = async (listQuestion: ItemQuestion[]) => {
            let objectQuestions = {
                quizze: {
                    title: title.value,
                    category_id: categoryId.value
                },
                questions: listQuestion
                
            }

            await api.quizze.createQuizze(objectQuestions, (res: any) => {
                ElNotification({title: "Success", message: "Tạo bộ câu hỏi thành công!", type: "success"});
                return navigateTo("/admin/dashboard/my-library");
            }, (err: ErrorResponse) => {
                ElNotification({title: "Error", message: err.error.shift(), type: "error"});
            })
        }

        const onFileChange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                fileListQuestion.value = file;
            }
        };

        const validateRowOfFile = () => {
            let isPassValidate: boolean = true;
            let errorMessagesValidate: string[] = [];
            if (contentOfFile.value.length > RULES_VALIDATION.FILE.MAX_QUESTION) {
                errorMessagesValidate.push("Bạn chỉ được tạo tối đa 100 câu hỏi");
                isPassValidate = false;
            }
            const questionOfFile: Array<ItemQuestion> = [];

            for (let i = 0; i < contentOfFile.value.length; i++) {
                const row: any = contentOfFile.value[i];
                const title = row.title?.trim() ?? '';
                if (Object.keys(row).filter((key: string) => key == 'title').length != 1) {
                    errorMessagesValidate.push("Format của file không hợp lệ!");
                    isPassValidate = false;
                    break;
                }

                let otherColumn = Object.keys(row).filter((key: string) => key != 'title');
                if (otherColumn.length > RULES_VALIDATION.QUESTION.MAX_ANSWER || otherColumn.length < RULES_VALIDATION.QUESTION.MIN_ANSWER) {
                    errorMessagesValidate.push(`Format file ở từng câu phải có từ 2 đến 4 câu trả lời!`);
                    isPassValidate = false;
                    break;
                };

                if (title.length > RULES_VALIDATION.QUESTION.TITLE.MAX_LENGTH || title.length < RULES_VALIDATION.QUESTION.TITLE.MIN_LENGTH) {
                    errorMessagesValidate.push(`Câu hỏi ${i + 1} phải có 6 đến 255 ký tự!`);
                    isPassValidate = false;
                }

                const countAnswerCorrect = Object.keys(row).filter((key: string) => key !== 'title').filter((key: string) => /\(true\)/.test(row[key])).length;
                if (countAnswerCorrect == 0) {
                    errorMessagesValidate.push(`Câu hỏi ${i + 1} phải có 1 đáp án đúng!`);
                    isPassValidate = false;
                }

                if (countAnswerCorrect > 1) {
                    errorMessagesValidate.push(`Câu hỏi ${i + 1} chỉ được có 1 đáp án đúng!`);
                    isPassValidate = false;
                }

                const answers = Object.keys(row).filter((key: string) => key !== 'title').map((key: string) => {
                    return {
                        answer: /\(true\)/.test(row[key]) ?
                            row[key].replace(/\(true\)/, '').trim() : row[key],
                        is_correct: /\(true\)/.test(row[key])
                    }
                })

                questionOfFile.push({title, answers});
            }

            errorMessagesUpload.value = errorMessagesValidate;
            contentOfFile.value = questionOfFile;

            return isPassValidate;
        }

        const uploadFileListQuestion = async (e: SubmitEvent) => {
            e.preventDefault();
            contentOfFile.value = [];
            errorMessagesPasteListQuestion.value = [];
            errorMessagesUpload.value = [];
            if (!validateFileQuestion()) return ;

            await Papa.parse(fileListQuestion.value, {
                header: true,
                skipEmptyLines: true,
                complete: async function(results: any) {
                    contentOfFile.value = results.data;
                    isValidQuestions.value = validateRowOfFile();
                    if (isValidQuestions.value) {
                        submitQuestions(contentOfFile.value);
                    }
                }.bind(this)
            });
        }

        const validateFileQuestion = () => {
            errorMessagesUpload.value = [];
            let isPassValidateFile: boolean = true;
            let errorMessagesValidate: string[] = [];

            if (title.value.trim() === '') {
                errorMessagesValidate.push("Tiêu đề đang để trống!");
                isPassValidateFile = false;
            }

            if (title.value.length > RULES_VALIDATION.QUESTION.TITLE.MAX_LENGTH || title.value.length < RULES_VALIDATION.QUESTION.TITLE.MIN_LENGTH) {
                errorMessagesValidate.push(`Tiêu đề  phải có 6 đến 255 ký tự!`);
                isPassValidateFile = false;
            }

            if (!categoryId.value) {
                errorMessagesValidate.push("Vui lòng chọn chủ đề!");
                isPassValidateFile = false;
            }

            if (fileListQuestion.value == null) {
                errorMessagesValidate.push("Vui lòng chọn file");
                errorMessagesUpload.value = errorMessagesValidate;
                isPassValidateFile = false;
                return false;
            }

            if (fileListQuestion.value.type != 'text/csv') {
                errorMessagesValidate.push("Định dạng file không hợp lệ");
                isPassValidateFile = false;
            }

            if (fileListQuestion.value.size > RULES_VALIDATION.FILE.MAX_SIZE_UPLOAD) {
                errorMessagesValidate.push("File không được vượt quá 5mb");
                isPassValidateFile = false;
            }

            errorMessagesUpload.value = errorMessagesValidate;

            return isPassValidateFile;
        }

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
    });

        const handleAddQuestion = () => {
            // isUpdate.value = false;
            // showModalCreateOrUpdateEditQuestion.value = true;
            // errorMessageUpdateQuestions.value = [];
            // currentQuestion.value = {
            //     id: '',
            //     title: '',
            //     quizze_id: '',
            //     answers: [],
            //     created_at: ''
            // };
            // for (let i = 0; i < RULES_VALIDATION.QUESTION.MAX_ANSWER; i++) {
            //     addAnswerOfQuestion();
            // }
        }

        const addAnswerOfQuestion = () => {
            currentQuestion.value.answers.push({
                id: currentQuestion.value.answers.length > 0 ? currentQuestion.value.answers[currentQuestion.value.answers.length - 1].id + 1 : 1,
                answer: '',
                is_correct: false,
                created_at: '',
            });
        }

        const removeAnswerOfQuestion = (answerId: number) => {
            currentQuestion.value.answers = currentQuestion.value.answers.filter((answer: Answer) => answer.id != answerId);
        }


        const updateQuestion = async () => {
            const resultValidate = validateQuestionUpdateOrCreate();
            if (!resultValidate) {
                return;
            }

            if (!isUpdate.value) {
                questionArray.value.push(
                    {
                        title: currentQuestion.value.title,
                        answers: currentQuestion.value.answers.map(answer => ({
                            answer: answer.answer,
                            is_correct: answer.is_correct
                        }) )
                    }
                );
            } else {
                let question = questionArray.value[currentIndexUpdate.value];
                question = currentQuestion.value;
                questionArray.value[currentIndexUpdate.value] = question;
                isUpdate.value = false;
            }

            showModalCreateOrUpdateEditQuestion.value = false;
        }



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

            let requiredQuestionTitle = validator.required(currentQuestion.value.title.trim(), "Câu hỏi");
            let isLengthTitleQuestion = validator.isLength(
                currentQuestion.value.title,
                "Câu hỏi",
                RULES_VALIDATION.QUESTION.TITLE.MIN_LENGTH,
                RULES_VALIDATION.QUESTION.TITLE.MAX_LENGTH,
                true,
            );

            if (requiredQuestionTitle != true) {
                errorMessagesValidate.push(requiredQuestionTitle);
                isPassvalidate = false;
            }

            if (isLengthTitleQuestion != true) {
                errorMessagesValidate.push(isLengthTitleQuestion);
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

        const createQuizz = async (e: SubmitEvent) => {
            e.preventDefault();
            errorMessagesPasteListQuestion.value = [];
            errorMessagesUpload.value = [];
            if (questionArray.value.length < 1) {
                errorMessagesPasteListQuestion.value.push("Vui lòng tạo câu hỏi!");
                return;
            }

            const validateResult = validateCreateQuestions();
            if (validateResult) {
                submitQuestions(questionArray.value);
            }

        }

        const validateCreateQuestions = () => {
            let isPassAllValidate: boolean = true;
            let errorMessagesValidateFail: string[] = [];
            if (title.value.trim() === '') {
                errorMessagesValidateFail.push("Tiêu đề đang để trống!");
                isPassAllValidate = false;
            }

            if (title.value.length > RULES_VALIDATION.QUESTION.TITLE.MAX_LENGTH || title.value.length < RULES_VALIDATION.QUESTION.TITLE.MIN_LENGTH) {
                errorMessagesValidateFail.push(`Tiêu đề  phải có 6 đến 255 ký tự!`);
                isPassAllValidate = false;
            }

            if (!categoryId.value) {
                errorMessagesValidateFail.push("Vui lòng chọn chủ đề!");
                isPassAllValidate = false;
            }
            errorMessagesPasteListQuestion.value = errorMessagesValidateFail;

            return isPassAllValidate;
        };

        const handleRemoveQuestion = (index: number) => {
            questionArray.value.splice(index, 1);
        };

        const handleEditQuestion = (item: ItemQuestion, index: number) => {
            showModalCreateOrUpdateEditQuestion.value = true;
            isUpdate.value = true;
            errorMessageUpdateQuestions.value = [];
            currentIndexUpdate.value = index;
            currentQuestion.value = {
                ...item,
                answers: item.answers.map(answer => ({
                    ...answer,
                    is_correct: !!answer.is_correct
                }))
            };
        }

        const closeModalCreateOrUpdate = () => {
            showModalCreateOrUpdateEditQuestion.value = false;
            isUpdate.value = false;
        }

        return {
            activeName,
            handleClick,
            createQuizz,
            listQuizzText,
            title,
            categoryId,
            uploadFileListQuestion,
            fileListQuestion,
            onFileChange,
            errorMessagesUpload,
            errorMessagesPasteListQuestion,
            listCategory,
            isUpdate,
            errorMessageUpdateQuestions,
            showModalDeleteQuestion,
            currentQuestionIdDelete,
            currentQuestion,
            maxAnswerOFQuestion,
            minAnswerOFQuestion,
            handleAddQuestion,
            addAnswerOfQuestion,
            showModalCreateOrUpdateEditQuestion,
            removeAnswerOfQuestion,
            updateQuestion,
            validateQuestionUpdateOrCreate,
            validateCreateQuestions,
            questionArray,
            handleRemoveQuestion,
            handleEditQuestion,
            closeModalCreateOrUpdate,
            mathfield,
            getLatex,
        }
    }
})
</script>
<style scoped>
@import '~/assets/styles/mathlive/core.scss';
@import '~/assets/styles/mathlive/environment-popover.scss';
@import '~/assets/styles/mathlive/fonts.scss';
@import '~/assets/styles/mathlive/keystroke-caption.scss';
@import '~/assets/styles/mathlive/mathfield.scss';
@import '~/assets/styles/mathlive/suggestion-popover.scss';
@import '~/assets/styles/mathlive/virtual-keyboard.scss';
.upload-icon {
    font-size: 50px;
}
.drag-file-area {
    margin: 10px 0 15px;
}
.browse-files {
    cursor: pointer;
}
.file-block {
    display: none;
    transition: all 0.5s;
}
.progress-bar {
    position: absolute;
    bottom: 0;
    left: 4.5%;
    width: 0;
    height: 5px;
    background-color: #4BB543;
}

:deep(.ql-editor) {
    min-height: 200px;
  }
  :deep(.ql-toolbar.ql-snow) {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  :deep(.ql-container.ql-snow) {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
</style>
