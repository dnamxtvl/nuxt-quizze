<template>
    <div class="settings-container">
        <!-- Header Section -->
        <div class="settings-header">
            <div class="header-content">
                <div class="settings-alert">
                    <RiErrorWarningLine class="me-2" />
                    <span class="alert-text">Chọn phạm vi áp dụng trước khi lưu</span>
                </div>
            </div>
            
            <!-- Last Modified Info -->
            <div class="last-modified-info">
                <div class="modified-content">
                    <RiUserLine class="me-2" />
                    <span class="modified-label">Chỉnh sửa gần nhất:</span>
                    <span class="modified-user">{{ lastModifiedInfo.userName }}</span>
                    <span class="modified-time">{{ lastModifiedInfo.time }}</span>
                </div>
            </div>
        </div>

        <!-- Settings Content -->
        <div class="settings-content">
            <div class="row g-4">
                <!-- Speed Priority Settings -->
                <div class="col-12 col-lg-6">
                    <div class="settings-card">
                        <div class="card-header">
                            <div class="header-icon">
                                <RiDashboardLine />
                            </div>
                            <div class="header-text">
                                <h3 class="card-title">Độ ưu tiên tốc độ</h3>
                                <p class="card-subtitle">Điều chỉnh cách tính điểm</p>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="setting-item">
                                <label class="setting-label">Hệ số</label>
                                
                                <!-- Mode Selection -->
                                <div class="mode-selection mb-3">
                                    <el-radio-group v-model="speedPriority.questionMode" @change="handleQuestionModeChange">
                                        <el-radio label="default" class="mode-radio">
                                            <span class="mode-label">Mặc định</span>
                                        </el-radio>
                                        <el-radio label="custom" class="mode-radio">
                                            <span class="mode-label">Tùy chỉnh</span>
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                                
                                <!-- Slider -->
                                <el-slider
                                    v-model="speedPriority.questionSpeed"
                                    :min="0"
                                    :max="100"
                                    :step="1"
                                    :marks="{0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%'}"
                                    show-stops
                                    show-input
                                    input-size="small"
                                    :disabled="speedPriority.questionMode === 'default'"
                                    class="custom-slider"
                                    :class="{ 'disabled-slider': speedPriority.questionMode === 'default' }"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Background Settings -->
                <div class="col-12 col-lg-6">
                    <div class="settings-card">
                        <div class="card-header">
                            <div class="header-icon">
                                <RiLandscapeLine />
                            </div>
                            <div class="header-text">
                                <h3 class="card-title">Hình nền</h3>
                                <p class="card-subtitle">Tùy chỉnh giao diện</p>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="setting-item">
                                <label class="setting-label">Hình nền hiện tại</label>
                                <div class="current-background">
                                    <img 
                                        :src="backgroundSettings.currentImage || '/img/winter.jpeg'" 
                                        alt="Background"
                                        class="background-preview"
                                    />
                                    <div class="background-overlay">
                                        <div class="background-controls d-flex justify-content-center">
                                            <el-button 
                                                type="primary" 
                                                size="small"
                                                @click="triggerBackgroundUpload"
                                            >
                                                <RiUploadLine class="me-1" />
                                                Thay đổi
                                            </el-button>
                                            <el-button 
                                                type="success" 
                                                size="small"
                                                @click="showBackgroundPreview"
                                            >
                                                <RiEyeLine class="me-1" />
                                                Xem trước
                                            </el-button>
                                        </div>
                                    </div>
                                </div>
                                <input 
                                    ref="backgroundInput"
                                    type="file" 
                                    accept="image/*"
                                    @change="handleBackgroundUpload"
                                    class="hidden-input"
                                />
                                <small class="text-danger">* Giới hạn: 5MB, chỉ chấp nhận file hình ảnh</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Music Settings -->
                <div class="col-12 col-lg-6">
                    <div class="settings-card">
                        <div class="card-header">
                            <div class="header-icon">
                                <RiVolumeUpLine />
                            </div>
                            <div class="header-text">
                                <h3 class="card-title">Nhạc nền</h3>
                                <p class="card-subtitle">Tùy chỉnh âm thanh</p>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="setting-item">
                                <label class="setting-label">Nhạc nền hiện tại</label>
                                <div class="current-music">
                                    <div class="music-info">
                                        <RiMusic2Line class="music-icon" />
                                        <div class="music-details">
                                            <span class="music-name">{{ backgroundMusic.currentName || 'Chưa có nhạc nền' }}</span>
                                            <div class="music-meta">
                                                <span class="music-duration">{{ backgroundMusic.duration || '' }}</span>
                                                <span v-if="backgroundMusic.currentFile" class="music-size">
                                                    {{ formatFileSize(backgroundMusic.currentFile.size) }}
                                                </span>
                                                <span v-else-if="backgroundMusic.oldName && backgroundMusic.currentName" class="music-source">
                                                    Nhạc từ server
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="music-controls">
                                        <el-button 
                                            v-if="hasMusicToPlay"
                                            type="success" 
                                            size="small"
                                            @click="playMusic"
                                        >
                                            <RiPlayLine />
                                        </el-button>
                                        <el-button 
                                            v-if="hasMusicToPlay"
                                            type="warning" 
                                            size="small"
                                            @click="stopMusic"
                                        >
                                            <RiStopLine />
                                        </el-button>
                                        <el-button 
                                            type="primary" 
                                            size="small"
                                            @click="triggerMusicUpload"
                                        >
                                            <RiUploadLine class="me-1" />
                                            {{ hasMusicToPlay ? 'Thay đổi' : 'Tải lên' }}
                                        </el-button>
                                    </div>
                                </div>
                                <input 
                                    ref="musicInput"
                                    type="file" 
                                    accept="audio/*"
                                    @change="handleMusicUpload"
                                    class="hidden-input"
                                />
                                <small class="text-danger">* Giới hạn: 5MB, chỉ chấp nhận file âm thanh</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quiz Scope Settings -->
                <div class="col-12 col-lg-6">
                    <div class="settings-card">
                        <div class="card-header">
                            <div class="header-icon">
                                <RiListCheck2 />
                            </div>
                            <div class="header-text">
                                <h3 class="card-title">Phạm vi áp dụng</h3>
                                <p class="card-subtitle">Chọn các quiz áp dụng cài đặt</p>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="setting-item">
                                <label class="setting-label">Danh sách quiz</label>
                                <el-select
                                    v-model="quizScope.selectedQuizzes"
                                    multiple
                                    filterable
                                    remote
                                    :remote-method="handleRemoteSearch"
                                    :loading="false"
                                    placeholder="Tìm kiếm các quiz để áp dụng cài đặt"
                                    class="custom-select"
                                    size="large"
                                    @focus="handleSelectFocus"
                                    @change="handleQuizSelectionChange"
                                >
                                    <el-option
                                        v-for="quiz in quizScope.availableQuizzes"
                                        :key="quiz.id"
                                        :label="quiz.title"
                                        :value="quiz.id"
                                        class="mb-1"
                                    >
                                        <div class="quiz-option">
                                            <span class="quiz-name">{{ quiz.title }}</span>
                                            <span class="quiz-type">{{ quiz.code }}</span>
                                        </div>
                                    </el-option>
                                </el-select>
                            </div>

                            <div class="setting-item" v-if="isNormalUser">
                                <label class="setting-label">Áp dụng cho tất cả</label>
                                <el-switch
                                    v-model="quizScope.applyToAll"
                                    active-text="Bật"
                                    inactive-text="Tắt"
                                    @change="handleApplyToAllChange"
                                    class="custom-switch"
                                />
                            </div>

                            <div class="setting-item">
                                <label class="setting-label">Quiz đã chọn ({{ quizScope.selectedQuizzes.length }})</label>
                                <div class="selected-quizzes">
                                    <el-tag
                                        v-for="quizId in quizScope.selectedQuizzes"
                                        :key="quizId"
                                        closable
                                        @close="removeQuiz(quizId)"
                                        class="quiz-tag"
                                    >
                                        {{ getQuizName(quizId) }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="settings-actions text-center mt-4">
                <div class="action-buttons">
                    <el-button 
                        type="info" 
                        size="large"
                        @click="resetSettings"
                        class="action-btn"
                    >
                        <RiRefreshLine class="me-2" />
                        Khôi phục cài đặt
                    </el-button>
                    
                    <el-button 
                        type="success" 
                        size="large"
                        @click="saveSettings"
                        :loading="isSaving"
                        class="action-btn primary"
                    >
                        <RiSaveLine class="me-2" />
                        Lưu cài đặt
                    </el-button>
                </div>
            </div>
        </div>

        <!-- Background Preview Modal -->
        <el-dialog
            v-model="previewModal.visible"
            width="90%"
            :show-close="true"
            class="preview-modal"
        >
            <div class="preview-container">
                <!-- Quiz Question Preview -->
                <div class="quiz-preview" :style="previewStyles">
                    <!-- Question Number -->
                    <div class="question-number">
                        <span class="number-circle">2.</span>
                    </div>
                    
                    <!-- Question Text -->
                    <div class="question-text">
                        Cướp biển thường được gọi là gì?
                    </div>
                    
                    <!-- Answer Options -->
                    <div class="answer-options">
                        <div class="answer-option option-1">
                            <span class="option-number">1</span>
                            <span class="option-text">Đạo tặc</span>
                        </div>
                        <div class="answer-option option-2">
                            <span class="option-number">2</span>
                            <span class="option-text">Lâm tặc</span>
                        </div>
                        <div class="answer-option option-3">
                            <span class="option-number">3</span>
                            <span class="option-text">Hải tặc</span>
                        </div>
                        <div class="answer-option option-4">
                            <span class="option-number">4</span>
                            <span class="option-text">Sơn tặc</span>
                        </div>
                    </div>
                </div>
                
                <!-- Preview Controls -->
                <div class="preview-controls">
                    <div class="control-group">
                        <label>Độ trong suốt: {{ backgroundSettings.opacity }}%</label>
                        <el-slider
                            v-model="backgroundSettings.opacity"
                            :min="0"
                            :max="100"
                            :step="5"
                            class="preview-slider"
                        />
                    </div>
                    <div class="control-group">
                        <el-button type="danger" @click="previewModal.visible = false">
                            Đóng
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, onUnmounted } from "vue";
import type { availableQuizze, ErrorResponse } from "~/constants/type";
import { ElLoading, ElNotification, ElMessage } from "element-plus";
import api from "~/api/axios";
import { useMainStore } from "~/store";
import { RiSettings3Line, RiDashboardLine, RiLandscapeLine, RiVolumeUpLine, RiListCheck2, RiUploadLine, RiPlayLine, RiStopLine, RiRefreshLine, RiSaveLine, RiErrorWarningLine, RiUserLine, RiRadioButtonLine, RiMusic2Line, RiEyeLine, RiSearchLine } from "@remixicon/vue";
import { USER_TYPE_ENUM } from "~/constants/user";
import moment from "moment";
import LocalStorageManager from "~/utils/localStorage";

definePageMeta({
    layout: "admin-dashboard",
})

export default defineComponent({
    components: {
        RiSettings3Line,
        RiDashboardLine,
        RiLandscapeLine,
        RiVolumeUpLine,
        RiListCheck2,
        RiUploadLine,
        RiPlayLine,
        RiStopLine,
        RiRefreshLine,
        RiSaveLine,
        RiErrorWarningLine,
        RiUserLine,
        RiRadioButtonLine,
        RiMusic2Line,
        RiEyeLine,
    },
    setup() {
        const backgroundInput = ref<HTMLInputElement>();
        const musicInput = ref<HTMLInputElement>();
        const isSaving = ref<boolean>(false);
        const store = useMainStore();
        const userRole = store.$state.user?.type as number;
        const isNormalUser = userRole === USER_TYPE_ENUM.USER;

        // Reactive data
        const speedPriority = reactive({
            questionSpeed: 100,
            questionMode: 'default',
            resultSpeed: 5
        });

        const backgroundSettings = reactive({
            currentImage: '',
            currentName: '',
            currentFile: null as File | null,
            opacity: 80
        });

        const backgroundMusic = reactive({
            currentFile: null as File | null,
            currentName: '',
            oldName: '',
            duration: '',
            volume: 50,
            autoPlay: false,
            currentAudio: null as HTMLAudioElement | null
        });

        const quizScope = reactive({
            selectedQuizzes: [] as string[],
            applyToAll: false,
            availableQuizzes: [] as availableQuizze[],
            localStorageQuiz: null as any // Lưu trữ quiz từ localStorage
        });

        const lastModifiedInfo = reactive({
            userName: '',
            time: ''
        });

        const previewModal = reactive({
            visible: false
        });

        // Methods
        const triggerBackgroundUpload = () => {
            backgroundInput.value?.click();
        };

        const handleBackgroundUpload = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                // Validate dung lượng file (5MB = 5 * 1024 * 1024 bytes)
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    ElNotification({
                        title: 'Lỗi',
                        message: 'File hình nền phải nhỏ hơn 5MB',
                        type: 'error',
                        position: 'top-right'
                    });
                    return;
                }

                // Validate loại file
                if (!file.type.startsWith('image/')) {
                    ElNotification({
                        title: 'Lỗi',
                        message: 'Chỉ chấp nhận file hình ảnh',
                        type: 'error',
                        position: 'top-right'
                    });
                    return;
                }

                // Lưu file object và preview
                backgroundSettings.currentFile = file;
                backgroundSettings.currentImage = URL.createObjectURL(file);
                
                ElMessage.success('Đã tải lên hình nền thành công');
            }
        };

        const getAvailableQuizzes = async (keyword: string = '') => {
            await api.quizze.searchByKeyword(keyword, (res: availableQuizze[]) => {
                quizScope.availableQuizzes = res;
            }, (err: ErrorResponse) => {
                ElNotification({
                    title: 'Lỗi',
                    message: err.error.shift(),
                    type: 'error',
                    position: 'top-right'
                });
            });
        };

        const getLatestUpdate = async () => {
            await api.setting.getLatestUpdate((res: any) => {
                lastModifiedInfo.userName = res.user?.name ?? ''
                lastModifiedInfo.time = res.updated_at ? moment(res.updated_at).format('DD/MM/YYYY HH:mm:ss') : '';
            }, (err: ErrorResponse) => {
                ElNotification({
                    title: 'Lỗi',
                    message: err.error.shift(),
                    type: 'error',
                    position: 'top-right'
                });
            });
        };

        // Remote search method cho el-select với debounce
        let searchTimeout: NodeJS.Timeout;
        const handleRemoteSearch = async (query: string) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                if (query !== '') {
                    // Chỉ clear khi search keyword mới
                    quizScope.availableQuizzes = [];
                    await getAvailableQuizzes(query);
                } else {
                    // Khi search rỗng, giữ lại data cũ để hiển thị tag
                    if (quizScope.selectedQuizzes.length === 0) {
                        await getAvailableQuizzes(isNormalUser ? '' : query);
                    }
                    // Nếu có quiz được chọn, không clear availableQuizzes
                    // để giữ data hiển thị tag
                }
            }, 300);
        };

        // Handle select focus để clear old data
        const handleSelectFocus = () => {
            // Chỉ clear availableQuizzes nếu không có quiz nào được chọn
            // để tránh mất data hiển thị tag
            if (quizScope.selectedQuizzes.length === 0) {
                quizScope.availableQuizzes = [];
            }
            // Nếu có quiz được chọn từ localStorage, không được clear
            // để giữ data hiển thị tag
        };

        // Handle quiz selection change (thêm/bớt quiz)
        const handleQuizSelectionChange = (selectedValues: string[]) => {
            // Nếu bỏ chọn quiz hoặc clear tất cả thì bỏ "chọn tất cả"
            if (selectedValues.length < quizScope.availableQuizzes.length || selectedValues.length === 0) {
                quizScope.applyToAll = false;
            }
            // Cập nhật selectedQuizzes
            quizScope.selectedQuizzes = selectedValues;
        };

        // Xử lý quiz từ localStorage và load settings
        const handleQuizFromLocalStorage = async () => {
            const selectedQuizFromLocalStorage = LocalStorageManager.getItemWithKey('selectedQuizForSettings');
            if (selectedQuizFromLocalStorage) {
                // Lưu quiz vào biến riêng để không bị mất
                quizScope.localStorageQuiz = selectedQuizFromLocalStorage;
                
                quizScope.availableQuizzes.push({
                    id: selectedQuizFromLocalStorage.id,
                    title: selectedQuizFromLocalStorage.title || `Quiz ${selectedQuizFromLocalStorage.id}`,
                    code: selectedQuizFromLocalStorage.code,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
                
                // Tự động chọn quiz này
                quizScope.selectedQuizzes.push(selectedQuizFromLocalStorage.id);
                LocalStorageManager.removeItem('selectedQuizForSettings');
                await loadSettingsForQuiz(selectedQuizFromLocalStorage.id);
            }
        };

        // Load settings cho quiz cụ thể
        const loadSettingsForQuiz = async (quizId: string) => {
            await api.setting.getSetting(quizId, (res: any) => {
                // Fill data từ API response
                if (res.speed_priority !== undefined) {
                    speedPriority.questionSpeed = res.speed_priority;
                    speedPriority.questionMode = res.speed_priority === 100 ? 'default' : 'custom';
                }
                
                if (res.opacity !== undefined) {
                    backgroundSettings.opacity = res.opacity;
                }
                
                if (res.volume !== undefined) {
                    backgroundMusic.volume = res.volume;
                }
                
                if (res.auto_play !== undefined) {
                    backgroundMusic.autoPlay = res.auto_play;
                }
                
                // Fill data ảnh nền
                if (res.background) {
                    backgroundSettings.currentImage = res.background;
                    backgroundSettings.currentName = res.background_name;
                    // Nếu background là URL thì không cần currentFile
                    // Nếu background là base64 thì có thể cần xử lý thêm
                }
                
                // Fill data nhạc nền
                if (res.music) {
                    // Nếu music là file object hoặc URL
                    backgroundMusic.currentName = res.music_name || '';
                    backgroundMusic.oldName = res.music || '';
                    backgroundMusic.duration = res.music_duration || '';
                    
                    // Nếu music là file object thì cần xử lý thêm
                    // Có thể cần call API riêng để lấy file
                }
            }, (err: ErrorResponse) => {
                ElNotification({
                    title: 'Lỗi',
                    message: err.error.shift(),
                    type: 'warning',
                    position: 'top-right'
                });
            });
        };

        const triggerMusicUpload = () => {
            musicInput.value?.click();
        };

        const handleMusicUpload = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                // Validate dung lượng file (5MB = 5 * 1024 * 1024 bytes)
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    ElNotification({
                        title: 'Lỗi',
                        message: 'File nhạc phải nhỏ hơn 5MB',
                        type: 'error',
                        position: 'top-right'
                    });
                    return;
                }

                // Validate loại file audio
                if (!file.type.startsWith('audio/')) {
                    ElNotification({
                        title: 'Lỗi',
                        message: 'Chỉ chấp nhận file âm thanh',
                        type: 'error',
                        position: 'top-right'
                    });
                    return;
                }

                backgroundMusic.currentFile = file;
                backgroundMusic.currentName = file.name;
                
                // Get duration from audio file
                const audio = new Audio(URL.createObjectURL(file));
                audio.addEventListener('loadedmetadata', () => {
                    const minutes = Math.floor(audio.duration / 60);
                    const seconds = Math.floor(audio.duration % 60);
                    backgroundMusic.duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    ElMessage.success('Đã tải lên nhạc nền thành công');
                });
            }
        };

        const playMusic = () => {
            // Dừng nhạc cũ nếu đang phát
            if (backgroundMusic.currentAudio) {
                backgroundMusic.currentAudio.pause();
                backgroundMusic.currentAudio.currentTime = 0;
            }
            
            if (backgroundMusic.currentFile) {
                // Phát file nhạc mới được upload
                const audio = new Audio(URL.createObjectURL(backgroundMusic.currentFile));
                audio.volume = backgroundMusic.volume / 100;
                
                // Lưu reference để có thể control
                backgroundMusic.currentAudio = audio;
                
                // Phát nhạc
                audio.play();
                
                // Xử lý khi nhạc kết thúc
                audio.addEventListener('ended', () => {
                    backgroundMusic.currentAudio = null;
                });
            } else if (backgroundMusic.oldName && backgroundMusic.currentName) {
                // Phát nhạc cũ từ API (có thể là URL hoặc base64)
                const audio = new Audio(backgroundMusic.oldName);
                audio.volume = backgroundMusic.volume / 100;
                
                // Lưu reference để có thể control
                backgroundMusic.currentAudio = audio;
                
                // Phát nhạc
                audio.play();
                
                // Xử lý khi nhạc kết thúc
                audio.addEventListener('ended', () => {
                    backgroundMusic.currentAudio = null;
                });
                
                // Xử lý lỗi nếu không thể phát
                audio.addEventListener('error', () => {
                    ElNotification({
                        title: 'Lỗi',
                        message: 'Không thể phát nhạc từ server',
                        type: 'error',
                        position: 'top-right'
                    });
                    backgroundMusic.currentAudio = null;
                });
            }
        };

        const stopMusic = () => {
            if (backgroundMusic.currentAudio) {
                backgroundMusic.currentAudio.pause();
                backgroundMusic.currentAudio.currentTime = 0;
                backgroundMusic.currentAudio = null;
                ElMessage.success('Đã dừng nhạc nền');
            } else {
                ElMessage.info('Không có nhạc đang phát');
            }
        };

        const handleApplyToAllChange = (value: string | number | boolean) => {
            if (value === true) {
                quizScope.selectedQuizzes = quizScope.availableQuizzes.map(quiz => quiz.id);
            } else {
                quizScope.selectedQuizzes = [];
            }
        };

        const removeQuiz = (quizId: string) => {
            const index = quizScope.selectedQuizzes.indexOf(quizId);
            if (index > -1) {
                quizScope.selectedQuizzes.splice(index, 1);
            }
            quizScope.applyToAll = false;
        };

        const getQuizName = (quizId: string) => {
            // Tìm quiz trong availableQuizzes trước
            let quiz = quizScope.availableQuizzes.find(q => q.id === quizId);
            
            // Nếu không tìm thấy trong availableQuizzes, có thể quiz đã bị clear
            // Trả về ID để tránh hiển thị rỗng
            if (!quiz) {
                // Thử tìm trong localStorageQuiz để lấy title
                if (quizScope.localStorageQuiz && quizScope.localStorageQuiz.id === quizId) {
                    return quizScope.localStorageQuiz.title || `Quiz ${quizId}`;
                }
                return `Quiz ${quizId}`;
            }
            
            return quiz.title;
        };

        const handleQuestionModeChange = (mode: string | number | boolean | undefined) => {
            if (mode === 'default') {
                speedPriority.questionSpeed = 100;
            }
        };

        const handleVolumeChange = (volume: number | number[]) => {
            const vol = Array.isArray(volume) ? volume[0] : volume;
            if (backgroundMusic.currentAudio) {
                backgroundMusic.currentAudio.volume = vol / 100;
            }
        };

        const formatFileSize = (bytes: number): string => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
            const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
            return file.size <= maxSize;
        };

        // Computed properties
        const previewStyles = computed(() => {
            const opacity = backgroundSettings.opacity / 100;
            return {
                backgroundImage: `url(${backgroundSettings.currentImage || '/img/winter.jpeg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: `brightness(${0.7 + opacity * 0.3}) contrast(${0.8 + opacity * 0.4})`
            };
        });

        // Kiểm tra xem có nhạc để phát không
        const hasMusicToPlay = computed(() => {
            return backgroundMusic.currentFile !== null || 
                   (backgroundMusic.currentName && backgroundMusic.oldName);
        });

        // Preview methods
        const showBackgroundPreview = () => {
            previewModal.visible = true;
        };

        const applyPreviewSettings = () => {
            previewModal.visible = false;
            ElMessage.success('Đã áp dụng cài đặt hình nền');
        };

        const resetSettings = () => {
            speedPriority.questionSpeed = 100;
            speedPriority.questionMode = 'default';
            speedPriority.resultSpeed = 5;
            backgroundSettings.opacity = 80;
            backgroundSettings.currentImage = '';
            backgroundSettings.currentFile = null;
            backgroundMusic.volume = 50;
            backgroundMusic.autoPlay = false;
            backgroundMusic.currentFile = null;
            backgroundMusic.currentName = '';
            backgroundMusic.duration = '';
            
            // Dừng nhạc nếu đang phát
            if (backgroundMusic.currentAudio) {
                backgroundMusic.currentAudio.pause();
                backgroundMusic.currentAudio.currentTime = 0;
                backgroundMusic.currentAudio = null;
            }
            
            quizScope.selectedQuizzes = [];
            quizScope.applyToAll = false;
            ElMessage.success('Đã khôi phục cài đặt mặc định');
        };

        const saveSettings = async () => {
            if (quizScope.selectedQuizzes.length === 0) {
                ElNotification({
                    title: 'Warning',
                    message: 'Bạn chưa chọn phạm vi áp dụng!',
                    type: 'warning',
                    position: 'top-right'
                });
                return;
            }
            
            const params = {
                background: backgroundSettings.currentFile,
                old_background: backgroundSettings.currentImage,
                old_background_name: backgroundSettings.currentName,
                music: backgroundMusic.currentFile,
                old_music_name: backgroundMusic.currentName,
                old_music: backgroundMusic.oldName,
                current_music: backgroundMusic.currentName,
                speed_priority: speedPriority.questionSpeed,
                quizze_ids: quizScope.selectedQuizzes,
            }
            ElLoading.service({ fullscreen: true, text: 'Đang lưu cài đặt...' });
            await api.setting.updateSetting(params, (res: any) => {
                ElNotification({
                    title: 'Thành công',
                    message: 'Đã lưu cài đặt thành công',
                    type: 'success',
                    position: 'top-right'
                });

                navigateTo(userRole == USER_TYPE_ENUM.USER ? '/admin/dashboard/my-library' : '/admin/dashboard');
            }, (err: ErrorResponse) => {
                ElNotification({
                    title: 'Lỗi',
                    message: err.error.shift(),
                    type: 'error',
                    position: 'top-right'
                });
            });
            ElLoading.service({ fullscreen: true }).close();
        };

        // Handle page unload/redirect to stop music
        const handleBeforeUnload = () => {
            if (backgroundMusic.currentAudio) {
                backgroundMusic.currentAudio.pause();
                backgroundMusic.currentAudio.currentTime = 0;
                backgroundMusic.currentAudio = null;
            }
        };

        onBeforeUnmount(() => {
            window.removeEventListener('beforeunload', handleBeforeReload);
            ElLoading.service({ fullscreen: true }).close();
        });

        const handleBeforeReload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        }

        const handleVisibilityChange = () => {
            if (document.hidden && backgroundMusic.currentAudio) {
                backgroundMusic.currentAudio.pause();
                backgroundMusic.currentAudio.currentTime = 0;
                backgroundMusic.currentAudio = null;
            }
        };

        // Add event listeners
        onMounted(() => {
            window.addEventListener('beforeunload', handleBeforeUnload);
            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('beforeunload', handleBeforeReload);
        });

        // Cleanup event listeners
        onUnmounted(() => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            
            // Clear search timeout
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            // Stop music when component is unmounted
            if (backgroundMusic.currentAudio) {
                backgroundMusic.currentAudio.pause();
                backgroundMusic.currentAudio.currentTime = 0;
                backgroundMusic.currentAudio = null;
            }
        });

        // Handle Nuxt navigation
        const handleRouteChange = () => {
            if (backgroundMusic.currentAudio) {
                backgroundMusic.currentAudio.pause();
                backgroundMusic.currentAudio.currentTime = 0;
                backgroundMusic.currentAudio = null;
            }
        };

        // Use Nuxt composable for route changes
        if (process.client) {
            const router = useRouter();
            router.beforeEach(() => {
                handleRouteChange();
            });
        }

        // Add event listeners
        onMounted(async () => {
            window.addEventListener('beforeunload', handleBeforeUnload);
            document.addEventListener('visibilitychange', handleVisibilityChange);
            

            await handleQuizFromLocalStorage();
            await getAvailableQuizzes(userRole === USER_TYPE_ENUM.USER ? '' : '');
            await getLatestUpdate();
        });

        return {
            backgroundInput,
            musicInput,
            isSaving,
            speedPriority,
            backgroundSettings,
            backgroundMusic,
            quizScope,
            lastModifiedInfo,
            previewModal,
            previewStyles,
            isNormalUser,
            triggerBackgroundUpload,
            handleBackgroundUpload,
            triggerMusicUpload,
            handleMusicUpload,
            playMusic,
            stopMusic,
            handleApplyToAllChange,
            removeQuiz,
            getQuizName,
            handleQuestionModeChange,
            handleVolumeChange,
            formatFileSize,
            validateFileSize,
            showBackgroundPreview,
            applyPreviewSettings,
            resetSettings,
            saveSettings,
            handleRemoteSearch,
            handleSelectFocus,
            handleQuizSelectionChange,
            handleQuizFromLocalStorage,
            loadSettingsForQuiz,
            localStorageQuiz: quizScope.localStorageQuiz,
            hasMusicToPlay
        };
    }
})
</script>

<style scoped lang="scss">
@import '~/assets/styles/admin/admin-setting.scss';
</style>