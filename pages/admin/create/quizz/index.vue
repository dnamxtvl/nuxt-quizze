<template>
    <div class="row ms-4 me-4">
        <div class="app-email card h-100-vh">
            <div class="row g-0 h-100-vh">
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
                                <option :value="item.id" v-if="listCategory.length > 0" v-for="(item,index) in listCategory" :key="index">
                                    {{ item.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <el-tab-pane label="Dán câu hỏi" name="first">
                        <div class="flex flex-col w-full gap-6">
                            <span class="fw-500 fs-5 ms-3 mb-0">Sao chép và dán văn bản câu hỏi để tạo bài kiểm tra từ
                                đó <span class="text-danger">*</span></span>
                            <form class="p-3" @submit="createQuizz">
                                <textarea v-model="listQuizzText" :placeholder="'' + defaultPlaceholder"
                                    class="form-control list-question-textarea" name="" id="" cols="30"
                                    rows="22"></textarea>
                                <button type="submit" class="btn btn-primary mt-3 float-end">
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
                                            <a :href="useRuntimeConfig().public.BACKEND_URL + 'format_import_question.csv'" class="btn btn-success w-100 mt-3 upload-button text-white">
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
                    <!-- <el-tab-pane label="Nhập từng câu" name="third">
                        <h4 class="text-center">Tính năng sắp phát triển ^^
                        </h4>
                    </el-tab-pane> -->
                </el-tabs>
                <!-- End Create Quizz -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { ErrorResponse } from "~/constants/type";
import { ElNotification } from "element-plus";
import api from "~/api/axios";
import type { TabsPaneContext } from 'element-plus'
import { RiAddCircleFill, RiUploadLine, RiDownloadLine } from "@remixicon/vue";
import { RULES_VALIDATION } from "~/constants/application";
import Papa from 'papaparse';

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

interface Category {
    id: number;
    name: string,
    created_at: string
}

export default defineComponent({
    components: {
        RiAddCircleFill,
        RiUploadLine,
        RiDownloadLine,
    },
    setup() {
        const activeName = ref<string>('first')
        const defaultPlaceholder = ref<string>("Question 1 \n 1) answer 1 \n 2) answer 2 \n 3) answer 3 \n 4) answer 4 (true) \n \n Question 2 \n 1) answer 1 \n 2) answer 2 \n 3) answer 3 \n 4) answer 4 (true)");
        const listQuizzText = ref<string>('');
        const questionArray = ref([]);
        const title = ref<string>('');
        const categoryId = ref<number | "">("");
        const fileListQuestion = ref<File | null>(null);
        const errorMessagesUpload = ref<Array<string>>([]);
        const errorMessagesPasteListQuestion = ref<Array<string>>([]);
        const contentOfFile = ref<Array<ItemQuestion>>([]);
        const isValidQuestions = ref<boolean>(false);
        const listCategory = ref<Array<Category>>([]);

        const handleClick = (tab: TabsPaneContext, event: Event) => {
            console.log(tab, event)
        }

        const createQuizz = async (e: SubmitEvent) => {
            e.preventDefault();
            errorMessagesPasteListQuestion.value = [];
            errorMessagesUpload.value = [];
            if (listQuizzText.value.trim() === '') {
                errorMessagesPasteListQuestion.value.push("Vui lòng nhập danh sách câu hỏi!");
                return ;          
            }
            const blockQuestions = listQuizzText.value.trim().split(/\n\s*\n/);
            const validateResult = validateQuestions(blockQuestions);
            if (validateResult) {
                convertTextToQuestions();
                submitQuestions(questionArray.value);
            }
            
        }

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

        const validateQuestions = (blocks: any) => {
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

            for (let i = 0; i < blocks.length; i++) {
                const lines = blocks[i].trim().split('\n');
                const title = lines[0].trim();
                if (lines.length < RULES_VALIDATION.QUESTION.MIN_ANSWER || lines.length > RULES_VALIDATION.QUESTION.MAX_ANSWER) {
                    errorMessagesValidateFail.push(`Question "${title}" phải có từ 2 đến 4 câu trả lời!`);
                    isPassAllValidate = false;
                }
                const answerRegex = /^\d\)\s.+/;
                let correctAnswerCount = 0;

                for (let j = 1; j < lines.length; j++) {
                    const line = lines[j];
                    if (!answerRegex.test(line)) {
                        errorMessagesValidateFail.push(`Câu trả lời ${j} in "${title}" không đúng định dạng nhập.Phải là number) answer"!`);
                        isPassAllValidate = false;
                    }
                    if (/\(true\)/.test(line)) {
                        correctAnswerCount++;
                    }
                }
                if (correctAnswerCount !== 1) {
                    errorMessagesValidateFail.push(`Question "${title}" phải có 1 đáp án đúng!`);
                    isPassAllValidate =  false;
                }
            }

            errorMessagesPasteListQuestion.value = errorMessagesValidateFail;

            return isPassAllValidate;
        };

        const convertTextToQuestions = () => {
            const blocks = listQuizzText.value.trim().split(/\n\s*\n/); // Tách từng câu hỏi thành khối
            questionArray.value = blocks.map((block) => {
                const lines = block.trim().split('\n');
                
                const title = lines[0].trim(); // Câu hỏi là dòng đầu tiên
                const answers = lines.slice(1).map((line) => {
                    const isCorrect = /\(true\)/.test(line); // Kiểm tra câu trả lời đúng
                    const answer = line.replace(/\(true\)/, '').trim().split(') ')[1]; // Lấy phần trả lời sau số thứ tự

                    return {
                        answer,
                        is_correct: isCorrect,
                    };
                });

                return {
                    title,
                    answers,
                };
            });
        };

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

        onMounted(async () => {
            await getCatogory();
        })

        return {
            activeName,
            handleClick,
            defaultPlaceholder,
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
        }
    }
})
</script>
<style scoped>
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
</style>
