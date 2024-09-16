<template>
    <div class="row ms-4 me-4">
        <div class="app-email card h-100-vh">
            <div class="row g-0 h-100-vh">
                <!-- Create Quizz -->
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="Dán câu hỏi" name="first">
                        <div class="flex flex-col w-full gap-6">
                            <div class="row d-flex align-items-center ms-1 me-1">
                                <div class="col-md-6 mb-3">
                                    <label for="exampleInputEmail1" class="form-label fw-600 fs-5">Tiêu đề <span class="text-danger">*</span></label>
                                    <input v-model="title" type="text" class="form-control col-md-6" placeholder="Câu hỏi tin học">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="exampleInputEmail1" class="form-label fw-600 fs-5">Lĩnh vực <span class="text-danger">*</span></label>
                                    <select v-model="categoryId" type="text" class="form-control col-md-6" placeholder="Câu hỏi tin học">
                                        <option value="">Chọn lĩnh vực</option>
                                        <option value="1">Tin học</option>
                                        <option value="2">Giáo dục</option>
                                    </select>
                                </div>
                            </div>
                            <span class="fw-500 fs-5 ms-3 mb-0">Sao chép và dán văn bản câu hỏi để tạo bài kiểm tra từ đó <span class="text-danger">*</span></span>
                            <form class="p-3" @submit="createQuizz">
                                <textarea v-model="listQuizzText" :placeholder="'' + defaultPlaceholder" class="form-control list-question-textarea" name="" id="" cols="30" rows="22"></textarea>
                                <button type="submit" class="btn btn-primary mt-3 float-end"><RiAddCircleFill size="18" /> Tạo quizz</button>
                            </form>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Import" name="second">
                        <h4 class="text-center">Tính năng sắp phát triển ^^
                        </h4>
                    </el-tab-pane>
                    <el-tab-pane label="Nhập từng câu" name="third">
                        <h4 class="text-center">Tính năng sắp phát triển ^^
                        </h4>
                    </el-tab-pane>
                </el-tabs>
                <!-- End Create Quizz -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { ErrorResponse, ItemQuizze } from "~/constants/type";
import { ElLoading, ElNotification } from "element-plus";
import api from "~/api/axios";
import helperApp from "~/utils/helper";
import type { TabsPaneContext } from 'element-plus'
import { RiAddCircleFill } from "@remixicon/vue";
import { RULES_VALIDATION } from "~/constants/application";

definePageMeta({
    layout: "admin-dashboard",
})

export default defineComponent({
    components: {
        RiAddCircleFill
    },
    setup() {
        const activeName = ref<string>('first')
        const defaultPlaceholder = ref<string>("Question 1 \n 1) answer 1 \n 2) answer 2 \n 3) answer 3 \n 4) answer 4 (true) \nQuestion 2 \n 1) answer 1 \n 2) answer 2 \n 3) answer 3 \n 4) answer 4 (true)");
        const listQuizzText = ref<string>('');
        const questionArray = ref([]);
        const title = ref<string>('');
        const categoryId = ref<number>();

        const handleClick = (tab: TabsPaneContext, event: Event) => {
            console.log(tab, event)
        }

        const createQuizz = async (e: SubmitEvent) => {
            e.preventDefault();
            if (listQuizzText.value.trim() === '') {
                ElNotification({title: "Error", message: "Vui lòng nhập danh sách câu hỏi!", type: "error"});
                return ;          
            }
            const blockQuestions = listQuizzText.value.trim().split(/\n\s*\n/);
            const validateResult = validateQuestions(blockQuestions);
            if (validateResult) {
                convertTextToQuestions();
                let objectQuestions = {
                    quizze: {
                        title: title.value,
                        category_id: categoryId.value
                    },
                    questions: questionArray.value
                    
                }

                await api.quizze.createQuizze(objectQuestions, (res: any) => {
                    ElNotification({title: "Success", message: "Tạo bộ câu hỏi thành công!", type: "success"});
                    return navigateTo("/admin/dashboard/my-library");
                }, (err: ErrorResponse) => {
                    ElNotification({title: "Error", message: err.error.shift(), type: "error"});
                })
            }
            
        }

        const validateQuestions = (blocks: any) => {
            if (title.value.trim() === '') {
                ElNotification({title: "Error", message: "Tiêu đề đang để trống.", type: "error"});
                return false;
            }

            if (title.value.length > RULES_VALIDATION.QUESTION.TITLE.MAX_LENGTH || title.value.length < RULES_VALIDATION.QUESTION.TITLE.MIN_LENGTH) {
                ElNotification({title: "Error", message: `Tiêu đề  phải có 6 đến 255 ký tự.`, type: "error"});
                return false;
            }

            if (!categoryId.value) {
                ElNotification({title: "Error", message: "Vui lòng chọn lĩnh vực!", type: "error"});
                return false;
            }

            for (let i = 0; i < blocks.length; i++) {
                const lines = blocks[i].trim().split('\n');
                const title = lines[0].trim();
                if (lines.length < 3 || lines.length > 5) {
                    ElNotification({title: "Error", message: `Question "${title}" phải có từ 2 đến 4 câu trả lời.`, type: "error"});
                    return false;
                }
                const answerRegex = /^\d\)\s.+/;
                let correctAnswerCount = 0;

                for (let j = 1; j < lines.length; j++) {
                    const line = lines[j];
                    if (!answerRegex.test(line)) {
                        ElNotification({title: "Error", message: `Câu trả lời ${j} in "${title}" không đúng định dạng nhập.Phải là number) answer".`, type: "error"});
                        return false;
                    }
                    if (/\(true\)/.test(line)) {
                        correctAnswerCount++;
                    }
                }
                if (correctAnswerCount !== 1) {
                    ElNotification({title: "Error", message: `Question "${title}" phải có 1 đáp án đúng.`, type: "error"});
                    return false;
                }
            }

            return true;
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

        return {
            activeName,
            handleClick,
            defaultPlaceholder,
            createQuizz,
            listQuizzText,
            title,
            categoryId,
        }
    }
})
</script>
<style scoped>
</style>