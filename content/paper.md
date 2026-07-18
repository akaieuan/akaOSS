# A Measurement Problem

The enterprise AI landscape faces a fundamental crisis: despite $30–40 billion in investment, 95% of organizations achieve zero measurable return from generative AI initiatives (Challapally et al., 2025). This catastrophic failure-to-deployment gap stems not from technology limitations but from a systematic measurement problem embedded in how we evaluate AI systems.

Current benchmarks suffer from widespread quality degradation, with approximately 766 benchmarks saturating within months of release as rapid AI advancement outpaces evaluation stability (Ott et al., 2022, p. 1). More critically, these benchmarks measure the wrong thing: they test whether models can perform tasks autonomously when real-world deployment demands human-AI collaboration where the model assists rather than completes (Ott et al., 2022, p. 3).

This is a perspective paper — it presents no new empirical findings. It synthesizes evidence across four research areas (benchmark science, cognitive neuroscience, uncertainty quantification, and enterprise deployment data) to argue that the AI failure crisis is at root a measurement crisis, and proposes the "Assist-Not-Complete" paradigm as a reframing of how AI systems should be designed, evaluated, and deployed.

## Section 1: Understanding Why Autonomous Systems Fail

### 1.1 The Benchmark Saturation Crisis

Current AI benchmarks exhibit systemic quality failures that reflect fundamental design inadequacies rather than procedural oversights. Commonly used benchmarks suffer from significant problems across multiple dimensions (Ott et al., 2022, p. 1). The root cause involves construct validity deficiencies that prevent benchmarks from providing absolute performance signals, instead yielding only relative model comparisons (Ott et al., 2022, p. 1).

The problem manifests across implementation practices. Basic quality assurance standards such as GitHub build status checks for unit test validation are implemented in only 3 of 24 benchmarks despite established best practices in other evaluation domains (Ott et al., 2022, p. 3). Emerging quality standards including globally unique identifiers and encrypted evaluation instances to prevent data contamination remain adopted by only a minority of benchmarks (Ott et al., 2022, p. 3).

This systematic failure suggests that benchmark inadequacy reflects convergent failures in design and implementation rather than technical impossibility. Rapid model advancement drives saturation of existing evaluations as assessments approach obsolescence, while narrow benchmark design creates socio-technical gaps between measured capabilities and model performance in real-world applications (Ott et al., 2022, p. 3).

If benchmarks cannot remain stable long enough to differentiate model capabilities, they provide no reliable signal for model selection or improvement. Organizations cannot make informed decisions about which models to deploy, how to configure them, or whether improvements in benchmark scores translate to improvements in real-world performance. This measurement crisis directly enables the enterprise failure crisis documented below.

### 1.2 Enterprise Reality: The 95% Failure Rate

The enterprise deployment landscape reveals the true cost of measurement failures. Despite $30–40 billion in enterprise investment, 95% of organizations achieve zero measurable return from GenAI initiatives, with only 5% of integrated AI pilots extracting millions in value (Challapally et al., 2025).

The adoption-to-implementation breakdown reveals acute attrition across task-specific tools: 60% of organizations evaluated solutions but only 20% reached pilot stage and merely 5% attained production (Challapally et al., 2025). This 95% failure rate in enterprise-grade AI solutions exemplifies the GenAI Divide as a fundamental gap between organizational investment appetite and operational implementation capacity (Challapally et al., 2025).

The implications extend beyond financial loss. When 95% of AI initiatives fail to deliver measurable value, organizations lose confidence in AI capabilities broadly, reducing appetite for future investment even in genuinely valuable applications. The measurement problem, where benchmarks optimize for metrics rather than real-world performance, directly causes this enterprise failure cascade.

### 1.3 Competing Frameworks for Understanding AI System Failures

Understanding why autonomous AI systems fail requires examining multiple research perspectives, each illuminating different failure mechanisms.

#### *Cognitive Debt and Learning Impairment*

Early dependence on LLM writing assistance establishes cognitive debt through shallow semantic encoding that persists across multiple sessions without internalization (Kosmyna et al., 2025, p. 147). The complete absence of correct quoting in the LLM group during initial sessions, coupled with persistent impairments in later sessions, indicates that memory encoding remained superficial rather than deeply internalized (Kosmyna et al., 2025, p. 147).

This reflects an active degradation mechanism rather than mere encoding failure: early tool dependence directly impairs long-term semantic retention and contextual memory, systematically limiting individuals' ability to reconstruct content without continued assistance (Kosmyna et al., 2025, p. 147). The cognitive debt created by autonomous tool use persists and compounds. Individuals who initially use LLM assistance extensively show persistent deficits in subsequent sessions even when assistance is no longer available (Kosmyna et al., 2025, p. 147).

The takeaway is sharper than simple failure: autonomous systems don't just fail to improve human capability — they actively degrade it. By providing complete solutions, these systems prevent the cognitive effort necessary for deep learning and memory formation. The brain-only learning cohort demonstrated stronger behavioral recall accompanied by more robust EEG connectivity, indicating that initial unaided effort established durable memory traces enabling effective information reactivation after tool introduction (Kosmyna et al., 2025, p. 150).

Evaluating AI systems purely on immediate task performance misses a critical dimension: long-term impact on human capability. A system that enables immediate task completion while degrading long-term capability represents a net negative outcome, yet current benchmarks would score it as successful.

#### *Scaffolding Theory and Expertise-Dependent Assistance*

AI scaffolding displays a non-linear impact on task performance contingent on suggestion granularity and user expertise (Dhillon et al., 2024, p. 2). Sentence-level suggestions, exemplifying low scaffolding, significantly reduced writing quality by −0.29 points (*p* = .02) relative to baseline, while paragraph-level suggestions, exemplifying high scaffolding, improved quality by 0.18 points (*p* = .02) and yielded marked productivity gains (Dhillon et al., 2024, p. 2).

Fine-grained interventions constrain writer control and disrupt composition; broader paragraph-level assistance preserves agency while enabling substantive quality improvements (Dhillon et al., 2024, p. 2).

More critically, scaffolding efficacy is contingent on matching assistance granularity to user expertise level. Non-regular writers achieved the largest quality improvements from paragraph-level suggestions (0.53, *p* = .03), while regular writers improved modestly (0.07, *p* = .02), and professional writers experienced no statistically significant gains (Dhillon et al., 2024, p. 3). This inverse relationship reflects that professional writers possess sufficiently honed skills that AI cannot readily augment, and many deliberately avoid such assistance, fearing it could stifle creativity (Dhillon et al., 2024, p. 3).

One-size-fits-all autonomous systems cannot serve diverse user populations effectively. What works for novices (high-level paragraph suggestions) differs dramatically from what works for experts (minimal intervention). Yet current evaluation approaches typically test systems on uniform benchmarks, masking these critical interaction effects.

#### *The Quality-Satisfaction Paradox*

A fundamental paradox emerges in AI-assisted systems: improved output quality fails to enhance, and may actively diminish, user satisfaction and ownership (Dhillon et al., 2024, p. 11). While paragraph scaffolding produces higher quality text, this improvement paradoxically does not increase user satisfaction, and users report significantly diminished ownership over AI-assisted writing (Dhillon et al., 2024, p. 11).

The mechanism driving this disconnect is effort justification: satisfaction becomes tied to perceived effort rather than outcome quality, such that the reduced cognitive effort required by draft-providing systems lowers user satisfaction despite superior outputs (Dhillon et al., 2024, p. 11). This tension reveals a fundamental misalignment between optimizing for task output and preserving user agency and psychological investment (Dhillon et al., 2024, p. 2).

Notably, no significant cognitive burden was observed across conditions, indicating that dissatisfaction arises from psychological factors around agency and creative investment rather than task difficulty (Dhillon et al., 2024, p. 2). The finding reveals a deeper user preference for the writing process itself over outcome optimization alone, positioning this paradox within broader scaffolding literature concerns about maintaining human agency while providing support (Dhillon et al., 2024, p. 2).

These results suggest that effective AI-assisted tools must balance quality gains against preservation of user engagement and text ownership, challenging purely product-focused optimization strategies (Dhillon et al., 2024, p. 2). A system optimized solely for output quality will fail to deliver user satisfaction, and thus fail in deployment despite benchmark success.

#### *Uncertainty Quantification Limitations*

Classical uncertainty quantification frameworks prove inadequate for large language models due to novel uncertainty sources that transcend traditional aleatoric-epistemic categorizations (Liu et al., 2025, p. 1). LLMs introduce distinct uncertainty mechanisms, including input ambiguity, reasoning path divergence, and decoding stochasticity that extend beyond classical uncertainty decompositions (Liu et al., 2025, p. 1).

The inherent complexity of modern language models, characterized by sequence generation across vast parameter spaces and reliance on massive training datasets, further exacerbates these uncertainty challenges (Liu et al., 2025, p. 1), rendering conventional approaches insufficient and necessitating fundamentally reconceived methodologies specifically designed for the generative nature and scale of contemporary language models.

Current evaluation has a critical gap: benchmarks measure whether models produce correct answers, but not whether they accurately convey confidence in those answers. A model that confidently produces incorrect answers represents a greater failure than a model that tentatively produces incorrect answers, yet traditional accuracy metrics treat them identically. For collaborative systems where humans must verify and correct AI outputs, confidence calibration becomes as important as accuracy itself.

## Section 2: Where Autonomous AI Systems Fail in Practice

### 2.1 Multi-Hop Reasoning Tasks

Complex reasoning requiring evidence synthesis across multiple documents reveals critical limitations in autonomous AI systems. HotpotQA introduces a fundamental supervision gap that traditional benchmarks fail to address: prior datasets provide only distant supervision where "systems only know what the answer is, but do not know what supporting facts lead to it" (Yang et al., 2018, p. 1).

HotpotQA's 113k Wikipedia-based dataset requires reasoning over multiple documents unconstrained by knowledge bases and provides sentence-level supporting facts enabling strong supervision that allows models to learn underlying reasoning processes and produce explainable predictions (Yang et al., 2018, p. 1). This design directly instantiates the explicit objective to "provide the system with strong supervision about what text the answer is actually derived from, to help guide systems to perform meaningful and explainable reasoning" (Yang et al., 2018, p. 1).

Supporting facts provide dual functionality by enabling strong supervision that improves model performance while simultaneously supporting explainability evaluation (Yang et al., 2018, p. 7). Ablation analysis demonstrates the effectiveness of strong supervision over supporting facts, with removal of this signal decreasing overall performance (Yang et al., 2018, p. 7). In oracle settings where models provided supporting facts as context, they achieved greater than 10 F1 point improvements compared to models without this signal (Yang et al., 2018, p. 7).

The comprehensive evaluation structure reveals the gap between oracle and actual performance through dedicated metrics: the first set directly evaluates supporting fact extraction via EM and F1 computed against gold supporting fact sentences, while a second set features joint metrics combining evaluation of answer spans and supporting facts (Yang et al., 2018, p. 7). This substantial gap demonstrates that current systems cannot reliably identify the evidence supporting their conclusions.

For collaborative systems, this failure mode is critical. Humans cannot effectively verify or correct AI reasoning if the system cannot identify which evidence supports its conclusions. A system that produces correct answers without explaining its reasoning cannot support human oversight and verification — essential requirements for deployment in high-stakes domains.

### 2.2 Learning and Knowledge Retention

Educational deployment of LLM assistance reveals that autonomous tool use creates cognitive debt rather than enabling learning (Kosmyna et al., 2025, p. 150). An educational design principle that delays AI tool integration until learners engage in substantial self-driven cognitive effort mitigates cognitive debt while promoting both immediate tool efficacy and durable cognitive autonomy (Kosmyna et al., 2025, p. 150).

The brain-only learning cohort demonstrated stronger behavioral recall accompanied by more robust EEG connectivity, indicating that initial unaided effort established durable memory traces enabling effective information reactivation after tool introduction (Kosmyna et al., 2025, p. 150). This temporal sequencing prevents learner dependency by anchoring foundational cognition in independent effort, positioning AI assistants as scaffolds for established capabilities rather than substitutes for core learning processes (Kosmyna et al., 2025, p. 150).

Learners who initially studied without AI assistance showed substantially stronger memory retention and more robust neural connectivity when later tested, even after AI tool introduction (Kosmyna et al., 2025, p. 150). This suggests that the cognitive effort required for initial learning creates neural infrastructure that supports subsequent tool-assisted learning, whereas immediate tool use bypasses this infrastructure development.

A learning tool that enables immediate task completion without cognitive effort may appear successful short-term but creates long-term dependency and reduced capability. Yet traditional evaluation metrics would rate such a tool highly based on immediate performance improvements.

### 2.3 Writing and Composition Tasks

AI-assisted writing tools demonstrate that autonomous completion degrades both user experience and long-term capability development. The quality-satisfaction paradox reveals that improving output quality through AI scaffolding paradoxically reduces user satisfaction and ownership (Dhillon et al., 2024, p. 11).

Non-regular writers benefit most from high-level paragraph scaffolding (0.53 quality improvement, *p* = .03), while professional writers experience no significant gains and often deliberately avoid assistance (Dhillon et al., 2024, p. 3). This inverse expertise relationship demonstrates that scaffolding efficacy depends critically on matching assistance granularity to user capability level (Dhillon et al., 2024, p. 3).

The research shows that paragraph-level scaffolding succeeds because it provides sufficient cognitive support to reduce writing load while preserving author agency and adaptability, whereas granular sentence suggestions fall below the effectiveness threshold across user types (Dhillon et al., 2024, p. 3). For professional writers, who possess sufficiently honed skills that AI cannot readily augment, many deliberately avoid assistance, fearing it could stifle creativity or impose generic structure on distinctive writing (Dhillon et al., 2024, p. 3).

The quality-satisfaction paradox demonstrates that optimizing for output quality alone produces systems that users reject in practice (Dhillon et al., 2024, p. 11). When users perceive diminished investment and agency, they experience lower satisfaction despite superior final products. This creates a deployment failure mode where the system produces better outputs but users choose not to use it.

## Section 3: Redesigning AI Systems for Human Agency

### 3.1 Core Principle: Assistance as Augmentation, Not Automation

The fundamental design principle must shift from autonomous task completion to human-AI collaboration where the system assists rather than completes. This requires rethinking what we mean by "effective AI assistance."

**Preserving User Agency.** Systems must maintain meaningful user control and decision-making authority. Sentence-level suggestions reduce writing quality by 29% by constraining writer control and disrupting composition (Dhillon et al., 2024, p. 2), whereas paragraph-level assistance preserves agency while enabling substantive quality improvements (Dhillon et al., 2024, p. 2). The mechanism is clear: when AI systems provide fine-grained suggestions, they constrain the writer's exploration space and disrupt the compositional process. Broader suggestions provide scaffolding without constraining choice.

**Matching Granularity to Expertise.** Scaffolding effectiveness depends on aligning assistance level with user expertise. Non-regular writers require comprehensive high-level support, regular writers benefit from modest assistance, and professional writers need minimal intervention (Dhillon et al., 2024, p. 3). This expertise-dependent effectiveness means that one-size-fits-all systems will fail for some user populations. Effective systems must adapt assistance level to user capability.

**Prioritizing Long-Term Capability.** Assistance should enhance rather than substitute for core user competencies. Delayed AI integration until learners engage in substantial self-driven cognitive effort mitigates cognitive debt while promoting both immediate tool efficacy and durable cognitive autonomy (Kosmyna et al., 2025, p. 150). This principle suggests that effective assistance should be structured to ensure users develop foundational competencies before receiving tool support, preventing dependency and cognitive debt.

### 3.2 Explainability as Core Design Requirement

Explainable machine learning anchors human-in-the-loop AI by leveraging symbolic representations to render knowledge dependencies transparent and traceable (Zanzotto, 2019, p. 4). Symbolic representations provide essential tools to identify whose knowledge is embedded within specific models and to monitor knowledge flow throughout the AI lifecycle (Zanzotto, 2019, p. 4).

This approach exploits the established connection between distributed representations and symbolic structures, where embeddings approximate symbolic descriptions, while preserving empirical advances in image recognition, generation, captioning, machine translation, and game-playing (Zanzotto, 2019, p. 4).

Constructing fair, transparent human-in-the-loop AI ecosystems requires targeted investment in enabling technologies and legal frameworks that position symbolic explainability as both methodological principle and operational requirement for effective human-AI partnership (Zanzotto, 2019, p. 4).

For collaborative systems, explainability becomes a core requirement rather than a nice-to-have feature. Humans cannot effectively verify AI outputs or correct errors without understanding the reasoning behind those outputs. Systems that produce correct answers without explanation fail to support human oversight and verification.

### 3.3 Supporting Facts and Evidence-Based Reasoning

HotpotQA demonstrates that systems must provide explicit supporting facts enabling users to verify reasoning (Yang et al., 2018, p. 1). The comprehensive evaluation structure reveals the gap between oracle and actual performance through dedicated metrics: the first set directly evaluates supporting fact extraction via EM and F1 computed against gold supporting fact sentences, while a second set features joint metrics combining evaluation of answer spans and supporting facts (Yang et al., 2018, p. 7).

This dual evaluation structure instantiates a core design principle: users cannot effectively collaborate with systems that cannot explain their reasoning through explicit supporting evidence. The 10+ F1 point improvement in oracle settings where models provided supporting facts demonstrates the measurable value of the supervision signal (Yang et al., 2018, p. 7).

Supporting facts enable humans to verify whether the system's reasoning is sound, identify errors in reasoning even when final answers are correct, and understand the evidence base for conclusions. Without explicit supporting facts, humans must either blindly trust system outputs or perform verification work equivalent to solving the problem themselves — negating the assistance benefit.

## Section 4: Rethinking AI Evaluation Systems

### 4.1 The Fundamental Measurement Problem

Current evaluation frameworks measure whether models can perform tasks autonomously, not whether they can effectively assist humans in performing those tasks. This mismatch between evaluation criteria and deployment reality accounts for the 95% enterprise failure rate (Challapally et al., 2025).

**Critical Questions for Collaborative Systems:**

Can humans verify whether the model's answer is correct?

Can humans correct errors in the model's reasoning?

Does assistance improve human decision quality and speed?

Does long-term user capability improve or degrade?

Do users maintain meaningful agency and ownership?

### 4.2 Confidence Calibration and Uncertainty Quantification

Beyond accuracy, evaluation must assess whether systems accurately convey their confidence levels. Confidence calibration refers to closing the gap between a confidence score and the expected correctness conditioned on that confidence score (Liu et al., 2025, p. 3). Perfect calibration is formally defined such that for all confidence levels *c*, the expected model accuracy given confidence *c* equals *c* itself, evaluated over the joint distribution of inputs and generations (Liu et al., 2025, p. 3).

Evaluation employs two metrics: Expected Calibration Error (ECE) variants assess calibration quality, while AUROC and AUARC measure ranking performance, the discriminative power of confidence measures to separate correct from incorrect answers (Liu et al., 2025, p. 3).

For collaborative systems, confidence calibration becomes essential. Humans need accurate signals about system confidence to know when to verify outputs carefully and when to trust them. A system that confidently produces incorrect answers is worse than a system that tentatively produces incorrect answers, because it misleads human collaborators.

### 4.3 Why Autonomous Systems Fail: Evidence from Competing Frameworks

Benchmark saturation reflects fundamental construct validity deficiencies. Approximately 766 benchmarks have saturated within months of release as rapid AI advancement outpaces benchmark stability (Ott et al., 2022, p. 1). Consider how these measurement problems manifest in practice. DeepPlanning, a 2026 benchmark from Alibaba's Qwen team, exemplifies research rigor applied to the wrong measurement problem (Zhang et al., 2026). The paper implements sophisticated constraint verification — code-based evaluation of global constraints across temporal, spatial, and financial dimensions, three-stage task generation pipelines, and rule-based validation (Zhang et al., 2026). By every technical standard, DeepPlanning is well-constructed.

Yet it measures the wrong thing entirely. The benchmark evaluates whether frontier LLMs can optimize travel itineraries and shopping carts — domains where constraint satisfaction matters but professional consequence doesn't (Zhang et al., 2026). No measurement of citation accuracy. No calibration assessment. No framework for human authority or verification efficiency. The paper reports that GPT-5.2-high achieves only 35–44% case accuracy on DeepPlanning despite strong performance on traditional benchmarks, confirming the saturation thesis: benchmarks measure capability, not utility (Zhang et al., 2026).

But this misses the real insight. DeepPlanning proves that the problem isn't benchmark age — it's benchmark focus. When research teams build new, sophisticated evaluation frameworks, they still default to domains where consumer-scale convenience is the goal, not professional trust is the requirement (Zhang et al., 2026). The architectural rigor goes into measuring transactional optimization while professional knowledge work — where calibration failures become liability, where citation hallucination becomes fraud, where authority dispersal becomes negligence — remains unmeasured.

This is the structural failure: research incentives reward engineering excellence on measurement problems that scale to consumer markets, not on evaluation frameworks that would expose professional systems as unsuitable for deployment. Until benchmarking explicitly measures collaborative effectiveness — citation accuracy, calibration, verification efficiency, human authority preservation — new benchmarks will simply generate new evidence that autonomy-focused systems excel at the wrong metrics. The root cause involves construct validity deficiencies that prevent benchmarks from providing absolute performance signals, instead yielding only relative model comparisons (Ott et al., 2022, p. 1).

These structural limitations persist despite adherence to best practices, suggesting that current benchmark degradation reflects fundamental design failures rather than procedural oversight (Ott et al., 2022, p. 1). Implementation deficiencies compound these structural issues — basic quality assurance practices remain adopted by only a minority of benchmarks, while emerging best practices including globally unique identifiers and encrypted evaluation instances remain rare (Ott et al., 2022, p. 3).

Cognitive science research reveals that autonomous tool use creates cognitive debt through shallow semantic encoding (Kosmyna et al., 2025, p. 147). Early LLM assistance prevents deep encoding of information, with memory encoding remaining superficial rather than deeply internalized (Kosmyna et al., 2025, p. 147).

This reflects an active degradation mechanism: early tool dependence directly impairs long-term semantic retention and contextual memory, systematically limiting individuals' ability to reconstruct content without continued assistance (Kosmyna et al., 2025, p. 147). The cumulative pattern demonstrates that LLM-mediated task completion undermines rather than simply fails to build capability, with deficits compounding across multiple interventions (Kosmyna et al., 2025, p. 147).

Enterprise data reveals the true cost of autonomous system design. Despite $30–40 billion in investment, 95% of organizations achieve zero measurable return from GenAI initiatives, with systematic collapse where pilot engagement fails to translate into production deployment (Challapally et al., 2025).

The adoption-to-implementation breakdown shows that 60% of organizations evaluated task-specific tools but only 20% reached pilot stage and merely 5% attained production (Challapally et al., 2025). This systematic failure pattern indicates that autonomous systems fail to provide sufficient value in practice to justify deployment.

Complex reasoning tasks require explicit evidence synthesis that autonomous systems struggle to provide. HotpotQA addresses a fundamental supervision gap: prior datasets provide only distant supervision where "systems only know what the answer is, but do not know what supporting facts lead to it" (Yang et al., 2018, p. 1).

Supporting facts enable strong supervision that allows models to learn underlying reasoning processes and produce explainable predictions (Yang et al., 2018, p. 1). The 10+ F1 point improvement in oracle settings where models provided supporting facts demonstrates that autonomous reasoning fails without explicit evidence (Yang et al., 2018, p. 7).

Scaffolding effectiveness depends critically on matching assistance granularity to user expertise. Sentence-level suggestions reduce writing quality by 29% by constraining writer control (Dhillon et al., 2024, p. 2), while paragraph-level suggestions improve quality by 18% and preserve agency (Dhillon et al., 2024, p. 2).

More critically, scaffolding benefits decline with expertise: non-regular writers achieve 0.53 quality improvement (*p* = .03), regular writers achieve 0.07 (*p* = .02), and professional writers achieve no significant gains (Dhillon et al., 2024, p. 3). This inverse expertise relationship demonstrates that one-size-fits-all autonomous systems cannot effectively serve diverse user populations (Dhillon et al., 2024, p. 3).

### 4.4 Redesigning Evaluation for Collaborative Systems

Evaluation frameworks must shift from measuring autonomous performance to measuring collaborative effectiveness. This requires fundamentally new evaluation paradigms.

**Explainability Metrics.** Systems must provide supporting facts and evidence enabling human verification. Evaluation should measure whether users can understand and verify system reasoning (Yang et al., 2018, p. 1). Metrics might include: Can humans identify errors in system reasoning? Do users report understanding the reasoning? Can humans verify supporting facts?

**User Agency Preservation.** Evaluation should measure whether assistance maintains meaningful user control and decision-making authority. Systems should be evaluated on whether they enable or undermine user ownership (Dhillon et al., 2024, p. 11). Metrics might include: Do users report ownership over outputs? Does system assistance preserve user control? Do users choose to use the system?

**Long-Term Capability Impact.** Evaluation should measure whether assistance enhances or degrades long-term user capability. Systems should be assessed on whether they build user competence or create dependency (Kosmyna et al., 2025, p. 150). Metrics might include: Do users show improved capability over time? Does tool use reduce or increase user independence?

**Confidence Calibration.** Evaluation should measure whether systems accurately convey uncertainty. Systems should be assessed on whether confidence scores align with actual correctness (Liu et al., 2025, p. 3). Metrics include ECE, AUROC, and AUPRC.

**Collaborative Performance.** Evaluation should measure joint human-AI performance, not autonomous system performance. The metric should be whether humans using the system outperform humans without it while maintaining capability development (Dhillon et al., 2024, p. 3). This requires new evaluation paradigms that measure human-AI team performance rather than system-only performance.

## Moving From Measurement Crisis to Collaborative Design

The enterprise AI failure crisis stems from a fundamental measurement problem: we evaluate systems for autonomous task completion when deployment demands human-AI collaboration. This mismatch between evaluation criteria and deployment reality accounts for the 95% failure rate in enterprise AI initiatives (Challapally et al., 2025).

Competing research frameworks illuminate why autonomous systems fail. Benchmark design failures create systems optimized for metrics rather than real-world performance (Ott et al., 2022). Cognitive science evidence shows that autonomous tool use creates cognitive debt and undermines learning (Kosmyna et al., 2025). Commercial reality demonstrates that autonomous systems fail to provide sufficient value for production deployment (Challapally et al., 2025). Reasoning requirements show that complex tasks require explicit evidence synthesis that autonomous systems cannot provide (Yang et al., 2018). Scaffolding research reveals that assistance effectiveness depends on matching granularity to user expertise (Dhillon et al., 2024).

The Assist-Not-Complete paradigm provides a path forward: design systems to augment rather than automate, preserve user agency and long-term capability, provide explicit supporting facts enabling verification, and evaluate collaborative effectiveness rather than autonomous performance.

This fundamental reframing from autonomous systems to collaborative augmentation addresses the measurement problem at its root and provides the foundation for AI systems that can deliver value in practice. By shifting evaluation criteria from "Can the model solve this task?" to "Can the model effectively assist humans in solving this task while preserving their agency and capability?" we can finally align evaluation with deployment reality and break the cycle of benchmark-optimized systems that fail in practice.

The path forward requires reimagining AI evaluation, redesigning AI systems for human-AI collaboration, and rebuilding enterprise confidence through systems that demonstrably deliver value in real-world contexts.

---

## References

Challapally, A., Pease, C., Raskar, R., & Chari, P. (2025). *The GenAI divide: State of AI in business 2025*. MIT NANDA. https://nanda.media.mit.edu/ai_report_2025.pdf

Dhillon, P. S., Molaei, S., Li, J., Golub, M., Zheng, S., & Robert, L. P. (2024). Shaping human-AI collaboration: Varied scaffolding levels in co-writing with language models. In *Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems* (pp. 1–18). Association for Computing Machinery. https://doi.org/10.1145/3613904.3642134

Kosmyna, N., Hauptmann, E., Yuan, Y. T., Situ, J., Liao, X.-H., Beresnitzky, A. V., Braunstein, I., & Maes, P. (2025). *Your brain on ChatGPT: Accumulation of cognitive debt when using an AI assistant for essay writing task* (arXiv:2506.08872). arXiv. https://doi.org/10.48550/arXiv.2506.08872

Liu, X., Chen, T., Da, L., Chen, C., Lin, Z., & Wei, H. (2025). *Uncertainty quantification and confidence calibration in large language models: A survey* (arXiv:2503.15850). arXiv. https://doi.org/10.48550/arXiv.2503.15850

Ott, S., Barbosa-Silva, A., Blagec, K., Brauner, J., & Samwald, M. (2022). Mapping global dynamics of benchmark creation and saturation in artificial intelligence. *Nature Communications, 13*, 6793. https://doi.org/10.1038/s41467-022-34591-0

Yang, Z., Qi, P., Zhang, S., Bengio, Y., Cohen, W. W., Salakhutdinov, R., & Manning, C. D. (2018). HotpotQA: A dataset for diverse, explainable multi-hop question answering. In *Proceedings of the 2018 Conference on Empirical Methods in Natural Language Processing* (pp. 2369–2380). Association for Computational Linguistics. https://doi.org/10.18653/v1/D18-1259

Zanzotto, F. M. (2019). Viewpoint: Human-in-the-loop artificial intelligence. *Journal of Artificial Intelligence Research, 64*, 243–252. https://doi.org/10.1613/jair.1.11345

Zhang, Y., Jiang, S., Li, R., Tu, J., Su, Y., Deng, L., Guo, X., Lv, C., & Lin, J. (2026). *DeepPlanning: Benchmarking long-horizon agentic planning with verifiable constraints* (arXiv:2601.18137). arXiv. https://doi.org/10.48550/arXiv.2601.18137
