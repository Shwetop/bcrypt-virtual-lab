/* ==========================================================================
   Virtual Cryptography Lab - Bcrypt Module Script (Multi-Page Architecture)
   Client-Side Logic, Bcrypt Hashing, Verification & Interactive Tools
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lab Modules for current page
    BcryptLab.init();
});

const BcryptLab = {
    currentPipelineStage: 1,
    selectedStarRating: 0,
    quizState: {
        score: 0,
        answered: {}
    },

    // Initialize components based on DOM presence
    init() {
        this.checkBcryptLib();
        this.initNavigation();
        
        // Page-specific initializations
        if (document.querySelector('.tab-btn')) this.initTabs();
        if (document.getElementById('pwdInput')) this.initByteCounter();
        if (document.getElementById('hashGenForm')) this.initHashGenerator();
        if (document.getElementById('verifyForm')) this.initHashVerifier();
        if (document.getElementById('btnRunSaltDemo')) this.initSaltDemo();
        if (document.getElementById('inspectorInput')) this.initInspector();
        if (document.querySelector('.p-step')) this.initPipelineVisualizer();
        if (document.getElementById('quizQuestionsList')) this.initQuiz();
        if (document.getElementById('feedbackForm')) this.initFeedback();
    },

    // Check if bcryptjs loaded properly
    checkBcryptLib() {
        const bcryptObj = window.dcodeIO?.bcrypt || window.bcrypt;
        if (!bcryptObj) {
            console.warn("Bcrypt.js library not detected on window.");
        }
    },

    getBcrypt() {
        return window.dcodeIO?.bcrypt || window.bcrypt;
    },

    // Mobile Navigation Header Toggle
    initNavigation() {
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });
        }
    },

    // Theory Tab Switching
    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(targetTab)?.classList.add('active');
            });
        });
    },

    // Real-time Byte Counter & 72-Byte Warning
    initByteCounter() {
        const pwdInput = document.getElementById('pwdInput');
        const togglePwdBtn = document.getElementById('togglePwdBtn');
        const byteText = document.getElementById('byteText');
        const byteProgressFill = document.getElementById('byteProgressFill');
        const byteWarnBanner = document.getElementById('byteWarnBanner');

        if (!pwdInput || !byteText || !byteProgressFill) return;

        const updateByteCount = () => {
            const val = pwdInput.value;
            const bytes = new TextEncoder().encode(val).length;
            const percentage = Math.min(100, Math.round((bytes / 72) * 100));

            byteText.textContent = `Byte Length: ${bytes} / 72 bytes`;
            byteProgressFill.style.width = `${percentage}%`;

            if (bytes > 72) {
                byteProgressFill.className = 'progress-fill exceeded';
                byteWarnBanner?.classList.remove('hidden');
            } else if (bytes > 60) {
                byteProgressFill.className = 'progress-fill warn';
                byteWarnBanner?.classList.add('hidden');
            } else {
                byteProgressFill.className = 'progress-fill';
                byteWarnBanner?.classList.add('hidden');
            }
        };

        pwdInput.addEventListener('input', updateByteCount);
        updateByteCount(); // Init run

        // Toggle password visibility
        if (togglePwdBtn) {
            togglePwdBtn.addEventListener('click', () => {
                const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
                pwdInput.setAttribute('type', type);
                togglePwdBtn.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
            });
        }
    },

    // Tool 1: Bcrypt Hash Generator
    initHashGenerator() {
        const form = document.getElementById('hashGenForm');
        const btnGenHash = document.getElementById('btnGenHash');
        const pwdInput = document.getElementById('pwdInput');
        const costSelect = document.getElementById('costSelect');
        const hashPlaceholder = document.getElementById('hashPlaceholder');
        const hashOutputWrapper = document.getElementById('hashOutputWrapper');
        const hashOutputText = document.getElementById('hashOutputText');
        const metricTime = document.getElementById('metricTime');
        const metricRounds = document.getElementById('metricRounds');
        const metricLength = document.getElementById('metricLength');

        const btnCopyHash = document.getElementById('btnCopyHash');
        const btnSendToVerify = document.getElementById('btnSendToVerify');

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = pwdInput.value;
            const cost = parseInt(costSelect.value, 10);

            if (!password) return;

            btnGenHash.disabled = true;
            btnGenHash.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Hashing with Blowfish...';

            setTimeout(() => {
                const bcrypt = this.getBcrypt();
                if (!bcrypt) {
                    alert("Bcrypt library failed to load. Please check internet connection for CDN scripts.");
                    btnGenHash.disabled = false;
                    btnGenHash.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Bcrypt Hash';
                    return;
                }

                try {
                    const t0 = performance.now();
                    const salt = bcrypt.genSaltSync(cost);
                    const hash = bcrypt.hashSync(password, salt);
                    const t1 = performance.now();
                    const durationMs = (t1 - t0).toFixed(2);

                    // Render output
                    hashPlaceholder?.classList.add('hidden');
                    hashOutputWrapper?.classList.remove('hidden');
                    if (hashOutputText) hashOutputText.textContent = hash;

                    if (metricTime) metricTime.textContent = `${durationMs} ms`;
                    if (metricRounds) metricRounds.textContent = Math.pow(2, cost).toLocaleString();
                    if (metricLength) metricLength.textContent = `${hash.length} Chars`;

                    // Auto populate inspector if present
                    const inspectorInput = document.getElementById('inspectorInput');
                    if (inspectorInput) {
                        inspectorInput.value = hash;
                        this.parseAndInspectHash(hash);
                    }

                } catch (err) {
                    console.error("Bcrypt Hash Error:", err);
                    alert("Error generating Bcrypt hash: " + err.message);
                } finally {
                    btnGenHash.disabled = false;
                    btnGenHash.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Bcrypt Hash';
                }
            }, 50);
        });

        // Copy Hash Action
        btnCopyHash?.addEventListener('click', () => {
            const hashText = hashOutputText.textContent;
            navigator.clipboard.writeText(hashText).then(() => {
                const orig = btnCopyHash.innerHTML;
                btnCopyHash.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                setTimeout(() => btnCopyHash.innerHTML = orig, 1500);
            });
        });

        // Send to Verifier Action
        btnSendToVerify?.addEventListener('click', () => {
            const hashText = hashOutputText.textContent;
            const pwdVal = pwdInput.value;
            const verifyHashInput = document.getElementById('verifyHashInput');
            const verifyPwdInput = document.getElementById('verifyPwdInput');

            if (verifyHashInput && verifyPwdInput) {
                verifyHashInput.value = hashText;
                verifyPwdInput.value = pwdVal;
                verifyHashInput.scrollIntoView({ behavior: 'smooth' });
            }
        });
    },

    // Tool 2: Password Match Verifier
    initHashVerifier() {
        const form = document.getElementById('verifyForm');
        const verifyHashInput = document.getElementById('verifyHashInput');
        const verifyPwdInput = document.getElementById('verifyPwdInput');
        const btnVerify = document.getElementById('btnVerify');
        const verifyPlaceholder = document.getElementById('verifyPlaceholder');
        const verifyResultWrapper = document.getElementById('verifyResultWrapper');
        const vStatusCard = document.getElementById('vStatusCard');
        const vIcon = document.getElementById('vIcon');
        const vTitle = document.getElementById('vTitle');
        const vDesc = document.getElementById('vDesc');
        const vMetaText = document.getElementById('vMetaText');

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const targetHash = verifyHashInput.value.trim();
            const candidatePwd = verifyPwdInput.value;

            if (!targetHash || candidatePwd === undefined) return;

            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';

            setTimeout(() => {
                const bcrypt = this.getBcrypt();
                if (!bcrypt) {
                    btnVerify.disabled = false;
                    btnVerify.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Verify Password Match';
                    return;
                }

                try {
                    const t0 = performance.now();
                    const isMatch = bcrypt.compareSync(candidatePwd, targetHash);
                    const t1 = performance.now();
                    const durationMs = (t1 - t0).toFixed(2);

                    verifyPlaceholder?.classList.add('hidden');
                    verifyResultWrapper?.classList.remove('hidden');

                    if (isMatch) {
                        vStatusCard.className = 'v-status-card success';
                        vIcon.className = 'v-icon fa-solid fa-circle-check';
                        vTitle.textContent = '✅ MATCH SUCCESSFUL!';
                        vDesc.textContent = 'The candidate password matches the Bcrypt hash digest perfectly.';
                    } else {
                        vStatusCard.className = 'v-status-card danger';
                        vIcon.className = 'v-icon fa-solid fa-circle-xmark';
                        vTitle.textContent = '❌ MATCH FAILED!';
                        vDesc.textContent = 'The candidate password does NOT match the target hash.';
                    }

                    vMetaText.textContent = `Verification completed in ${durationMs} ms`;

                } catch (err) {
                    vStatusCard.className = 'v-status-card danger';
                    vIcon.className = 'v-icon fa-solid fa-triangle-exclamation';
                    vTitle.textContent = 'Invalid Hash Format';
                    vDesc.textContent = 'Please enter a valid 60-character Bcrypt hash string.';
                    vMetaText.textContent = `Error: ${err.message}`;
                    verifyPlaceholder?.classList.add('hidden');
                    verifyResultWrapper?.classList.remove('hidden');
                } finally {
                    btnVerify.disabled = false;
                    btnVerify.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Verify Password Match';
                }
            }, 50);
        });
    },

    // Tool 3: Random Salt & Non-Determinism Demo
    initSaltDemo() {
        const btnRunSaltDemo = document.getElementById('btnRunSaltDemo');
        const saltDemoPwd = document.getElementById('saltDemoPwd');
        const saltHash1 = document.getElementById('saltHash1');
        const saltHash2 = document.getElementById('saltHash2');
        const saltHash3 = document.getElementById('saltHash3');
        const saltVal1 = document.getElementById('saltVal1');
        const saltVal2 = document.getElementById('saltVal2');
        const saltVal3 = document.getElementById('saltVal3');
        const btnVerifyAllSalts = document.getElementById('btnVerifyAllSalts');
        const saltVerifyStatus = document.getElementById('saltVerifyStatus');

        if (!btnRunSaltDemo) return;

        let generatedDemoHashes = [];

        btnRunSaltDemo.addEventListener('click', () => {
            const pwd = saltDemoPwd.value || "SameSecretPassword123";
            const bcrypt = this.getBcrypt();
            if (!bcrypt) return;

            btnRunSaltDemo.disabled = true;
            btnRunSaltDemo.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating 3 Hashes...';

            setTimeout(() => {
                generatedDemoHashes = [];
                const cost = 8; // Fast cost 8 for 3 quick hashes

                for (let i = 0; i < 3; i++) {
                    const salt = bcrypt.genSaltSync(cost);
                    const hash = bcrypt.hashSync(pwd, salt);
                    generatedDemoHashes.push(hash);
                }

                if (saltHash1) saltHash1.textContent = generatedDemoHashes[0];
                if (saltVal1) saltVal1.textContent = `Salt: ${generatedDemoHashes[0].substring(7, 29)}`;

                if (saltHash2) saltHash2.textContent = generatedDemoHashes[1];
                if (saltVal2) saltVal2.textContent = `Salt: ${generatedDemoHashes[1].substring(7, 29)}`;

                if (saltHash3) saltHash3.textContent = generatedDemoHashes[2];
                if (saltVal3) saltVal3.textContent = `Salt: ${generatedDemoHashes[2].substring(7, 29)}`;

                btnRunSaltDemo.disabled = false;
                btnRunSaltDemo.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Generate 3 Hashes for Same Password';

                if (btnVerifyAllSalts) btnVerifyAllSalts.disabled = false;
                if (saltVerifyStatus) saltVerifyStatus.innerHTML = '<span class="text-muted">3 Hashes generated with unique 128-bit salts. Click button to verify.</span>';
            }, 50);
        });

        btnVerifyAllSalts?.addEventListener('click', () => {
            const pwd = saltDemoPwd.value || "SameSecretPassword123";
            const bcrypt = this.getBcrypt();
            if (!bcrypt || generatedDemoHashes.length !== 3) return;

            const res1 = bcrypt.compareSync(pwd, generatedDemoHashes[0]);
            const res2 = bcrypt.compareSync(pwd, generatedDemoHashes[1]);
            const res3 = bcrypt.compareSync(pwd, generatedDemoHashes[2]);

            if (res1 && res2 && res3) {
                saltVerifyStatus.innerHTML = '<span class="text-green"><i class="fa-solid fa-circle-check"></i> SUCCESS: All 3 distinct hashes verified TRUE against the exact same password!</span>';
            } else {
                saltVerifyStatus.innerHTML = '<span class="text-red"><i class="fa-solid fa-circle-xmark"></i> Verification failed.</span>';
            }
        });
    },

    // Tool 4: Hash Structure Inspector
    initInspector() {
        const inspectorInput = document.getElementById('inspectorInput');
        if (inspectorInput) {
            inspectorInput.addEventListener('input', (e) => {
                this.parseAndInspectHash(e.target.value.trim());
            });
            this.parseAndInspectHash(inspectorInput.value.trim());
        }
    },

    parseAndInspectHash(hashStr) {
        const segVer = document.getElementById('segVer');
        const segCost = document.getElementById('segCost');
        const segSalt = document.getElementById('segSalt');
        const segDigest = document.getElementById('segDigest');

        const detailVer = document.getElementById('detailVer');
        const detailCost = document.getElementById('detailCost');
        const detailRounds = document.getElementById('detailRounds');
        const detailSaltLen = document.getElementById('detailSaltLen');
        const detailDigestLen = document.getElementById('detailDigestLen');

        if (!hashStr || hashStr.length < 60 || !hashStr.startsWith('$2')) {
            if (segVer) segVer.textContent = "$2b$";
            if (segCost) segCost.textContent = "10$";
            if (segSalt) segSalt.textContent = "Invalid Hash Length";
            if (segDigest) segDigest.textContent = "...";
            return;
        }

        try {
            const parts = hashStr.split('$');
            const ver = `$${parts[1]}$`;
            const cost = `${parts[2]}$`;
            const payload = parts[3] || "";
            const salt = payload.substring(0, 22);
            const digest = payload.substring(22);

            if (segVer) segVer.textContent = ver;
            if (segCost) segCost.textContent = cost;
            if (segSalt) segSalt.textContent = salt;
            if (segDigest) segDigest.textContent = digest;

            const costInt = parseInt(parts[2], 10) || 10;
            const rounds = Math.pow(2, costInt);

            if (detailVer) detailVer.textContent = ver;
            if (detailCost) detailCost.textContent = costInt;
            if (detailRounds) detailRounds.innerHTML = `2<sup>${costInt}</sup> = ${rounds.toLocaleString()} Rounds`;
            if (detailSaltLen) detailSaltLen.textContent = `${salt.length} Base64 Chars (128 bits)`;
            if (detailDigestLen) detailDigestLen.textContent = `${digest.length} Base64 Chars (192 bits)`;

        } catch (err) {
            console.error("Inspector parse error:", err);
        }
    },

    // Interactive Pipeline Visualizer
    initPipelineVisualizer() {
        const btnPrevStage = document.getElementById('btnPrevStage');
        const btnNextStage = document.getElementById('btnNextStage');
        const stageCounter = document.getElementById('stageCounter');
        const pSteps = document.querySelectorAll('.p-step');
        const pStages = document.querySelectorAll('.p-stage-content');

        if (!pSteps.length) return;

        const updateStageUI = (stageNum) => {
            this.currentPipelineStage = stageNum;

            pSteps.forEach(step => {
                const s = parseInt(step.getAttribute('data-step'), 10);
                if (s === stageNum) step.classList.add('active');
                else step.classList.remove('active');
            });

            pStages.forEach((stage, idx) => {
                if (idx + 1 === stageNum) stage.classList.add('active');
                else stage.classList.remove('active');
            });

            if (stageCounter) stageCounter.textContent = `Step ${stageNum} of 5`;
            if (btnPrevStage) btnPrevStage.disabled = stageNum === 1;
            if (btnNextStage) btnNextStage.disabled = stageNum === 5;
        };

        pSteps.forEach(step => {
            step.addEventListener('click', () => {
                const s = parseInt(step.getAttribute('data-step'), 10);
                updateStageUI(s);
            });
        });

        btnPrevStage?.addEventListener('click', () => {
            if (this.currentPipelineStage > 1) updateStageUI(this.currentPipelineStage - 1);
        });

        btnNextStage?.addEventListener('click', () => {
            if (this.currentPipelineStage < 5) updateStageUI(this.currentPipelineStage + 1);
        });
    },

    // Quiz Engine
    initQuiz() {
        const questions = [
            {
                q: "1. Why is fast hashing (e.g. SHA-256) dangerous for user password storage?",
                opts: [
                    "SHA-256 produces variable length hashes.",
                    "Attackers can use GPUs to compute over 100 billion SHA-256 hashes per second, enabling rapid rainbow table brute-forcing.",
                    "SHA-256 requires a secret key that is easily stolen.",
                    "SHA-256 cannot hash passwords longer than 10 characters."
                ],
                ans: 1,
                exp: "Fast hash functions allow attackers to brute-force billions of candidate passwords per second on modern consumer GPUs."
            },
            {
                q: "2. How does increasing the Bcrypt cost factor by 1 affect computation work?",
                opts: [
                    "It increases computation time linearly by 10%.",
                    "It doubles the internal Blowfish key expansion iterations (2^cost).",
                    "It quadruples the length of the generated hash string.",
                    "It increases the salt length from 128 bits to 256 bits."
                ],
                ans: 1,
                exp: "Because work factor iterations = 2^cost, incrementing cost by 1 doubles the iterations (2^(C+1) = 2 * 2^C)."
            },
            {
                q: "3. What is the main purpose of adding a unique 128-bit random salt to each password?",
                opts: [
                    "To shorten the final hash length.",
                    "To make the password readable by system admins.",
                    "To defeat precomputed rainbow table attacks and ensure identical passwords yield different hashes.",
                    "To allow reversible decryption of forgotten passwords."
                ],
                ans: 2,
                exp: "Salts ensure every hash is unique, forcing attackers to build custom rainbow tables for every individual user."
            },
            {
                q: "4. What is the maximum password length limit imposed by the standard Bcrypt cipher?",
                opts: [
                    "32 bytes",
                    "64 bytes",
                    "72 bytes",
                    "256 bytes"
                ],
                ans: 2,
                exp: "Eksblowfish caps input keys at 72 bytes. Characters beyond byte 72 are silently truncated unless pre-hashed with SHA-256."
            },
            {
                q: "5. In the Bcrypt hash string '$2b$10$nOUIs22Chars...31Chars...', what does '$2b$' represent?",
                opts: [
                    "The cost factor parameter.",
                    "The 128-bit salt value.",
                    "The algorithm version identifier (OpenBSD Bcrypt Revision B).",
                    "The length of the password."
                ],
                ans: 2,
                exp: "$2b$ is the standard version identifier indicating OpenBSD's 2014 revision of the Bcrypt algorithm."
            }
        ];

        const quizQuestionsList = document.getElementById('quizQuestionsList');
        const quizScoreBadge = document.getElementById('quizScoreBadge');
        const btnRestartQuiz = document.getElementById('btnRestartQuiz');

        if (!quizQuestionsList) return;

        const renderQuiz = () => {
            this.quizState.score = 0;
            this.quizState.answered = {};
            if (quizScoreBadge) quizScoreBadge.textContent = `Score: 0 / ${questions.length}`;
            quizQuestionsList.innerHTML = '';

            questions.forEach((qObj, qIdx) => {
                const qCard = document.createElement('div');
                qCard.className = 'quiz-q-card';
                qCard.id = `qCard-${qIdx}`;

                let optsHTML = '';
                qObj.opts.forEach((optText, oIdx) => {
                    optsHTML += `
                        <button class="q-opt-btn" data-q="${qIdx}" data-opt="${oIdx}">
                            ${String.fromCharCode(65 + oIdx)}. ${optText}
                        </button>
                    `;
                });

                qCard.innerHTML = `
                    <div class="q-title">${qObj.q}</div>
                    <div class="q-options">${optsHTML}</div>
                    <div class="q-explanation hidden" id="qExp-${qIdx}">${qObj.exp}</div>
                `;

                quizQuestionsList.appendChild(qCard);
            });

            // Bind click handlers
            const optBtns = quizQuestionsList.querySelectorAll('.q-opt-btn');
            optBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const qIdx = parseInt(btn.getAttribute('data-q'), 10);
                    const selectedOpt = parseInt(btn.getAttribute('data-opt'), 10);

                    if (this.quizState.answered[qIdx] !== undefined) return;

                    this.quizState.answered[qIdx] = selectedOpt;
                    const qObj = questions[qIdx];
                    const qCard = document.getElementById(`qCard-${qIdx}`);
                    const expBox = document.getElementById(`qExp-${qIdx}`);
                    const siblings = qCard.querySelectorAll('.q-opt-btn');

                    siblings.forEach((sBtn, idx) => {
                        sBtn.disabled = true;
                        if (idx === qObj.ans) sBtn.classList.add('correct');
                        if (idx === selectedOpt && selectedOpt !== qObj.ans) sBtn.classList.add('wrong');
                    });

                    if (selectedOpt === qObj.ans) {
                        this.quizState.score++;
                    }

                    expBox?.classList.remove('hidden');
                    if (quizScoreBadge) quizScoreBadge.textContent = `Score: ${this.quizState.score} / ${questions.length}`;
                });
            });
        };

        btnRestartQuiz?.addEventListener('click', renderQuiz);
        renderQuiz();
    },

    // Feedback Star Rating & Form Submit
    initFeedback() {
        const starRating = document.getElementById('starRating');
        const form = document.getElementById('feedbackForm');
        const toastNotification = document.getElementById('toastNotification');

        if (starRating) {
            const stars = starRating.querySelectorAll('.fa-star');
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    const rating = parseInt(star.getAttribute('data-value'), 10);
                    this.selectedStarRating = rating;

                    stars.forEach((s, idx) => {
                        if (idx < rating) {
                            s.className = 'fa-star fa-solid active';
                        } else {
                            s.className = 'fa-star fa-regular';
                        }
                    });
                });
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (toastNotification) {
                    toastNotification.classList.remove('hidden');
                    setTimeout(() => toastNotification.classList.add('hidden'), 3500);
                }

                form.reset();
                this.selectedStarRating = 0;
                if (starRating) {
                    starRating.querySelectorAll('.fa-star').forEach(s => s.className = 'fa-star fa-regular');
                }
            });
        }
    }
};
