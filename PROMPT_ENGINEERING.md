# Prompt Engineering Guide - ResearchPilot AI

Prompts used in the ResearchPilot AI system for optimal performance with LLMs.

## 1. Summarization Prompts

### Primary Summarization Prompt

```
Analyze this academic paper and provide a structured summary. Return a JSON response with exactly these fields:

Paper Text:
{paper_text}

Respond ONLY with valid JSON (no markdown, no extra text) with these exact fields:
{
    "summary": "A concise 5-line summary",
    "key_contributions": ["contribution 1", "contribution 2", "contribution 3"],
    "methodology": "Brief explanation of methodology used",
    "limitations": "Key limitations of the research",
    "future_scope": "Potential future research directions"
}
```

**Best Practices:**
- Limit text to first 4000 characters for API cost
- Request JSON-only output to avoid parsing errors
- Specify field names exactly to ensure structure
- Ask for 5-line limit to get concise summaries

### Alternative: For Fallback Model

When using transformer models without API:

```
Summarize the following research paper in 3-5 sentences:

{paper_text}

Focus on:
1. Main contribution
2. Method/approach
3. Key results
4. Implications
```

---

## 2. Q&A Prompts (RAG)

### Primary Q&A Prompt

```
Based on the following research paper context, answer the user's question accurately and concisely.

Context from paper:
{context_chunks}

Question: {user_question}

Provide a clear, accurate answer based ONLY on the context provided. If the context doesn't contain information to answer the question, say so clearly.
```

**Tips:**
- Include context chunks from FAISS retrieval
- Force model to use only provided context
- Instruct model to admit when answer is unavailable
- Keep context to ~3000 characters for speed

### Example with Strong Grounding

```
You are a research assistant helping users understand academic papers.

Paper context:
{context}

User question: {question}

Requirements:
1. Answer ONLY using the paper context
2. If context doesn't answer the question, say "The paper doesn't address this"
3. Be specific and cite the relevant section
4. Keep answer to 2-3 sentences

Answer:
```

---

## 3. Literature Review Prompts

### Literature Review Generation

```
Create a comprehensive literature review on the topic: {topic}

For each of the following {num_papers} papers, provide:
1. A brief summary (100 words)
2. Key contributions (3-4 bullet points)
3. How it relates to the topic

Then provide:
- Research gaps identified
- Common methodologies used
- Future research directions

Format as structured markdown with clear sections.
```

### Research Gap Identification

```
Based on the papers about {topic}, what are the main research gaps?

Papers reviewed:
{paper_summaries}

Identify:
1. Topics with limited coverage
2. Methodological gaps
3. Application areas not explored
4. Contradictory findings
5. Opportunities for new research

Format as a bulleted list.
```

---

## 4. Title and Abstract Analysis

### Extract Key Concepts

```
From this paper title and abstract, extract:
1. Main problem being addressed
2. Proposed solution
3. Key novel contribution
4. Research methodology
5. Expected results

Title: {title}
Abstract: {abstract}

Respond in JSON format.
```

---

## 5. Citation Extraction

### Extract Citations

```
From the following paper excerpt, identify all citations and their context:

{paper_text}

For each citation, provide:
- Author/year
- What is being cited
- Why it's relevant

Format as a structured list.
```

---

## 6. Optimization Tips by Model

### For Google Gemini

- Use natural language over technical syntax
- Provide examples in prompt
- Gemini handles creative tasks well
- Good at summarization and analysis
- Fast (good for timeouts)

**Best prompt template:**
```
You are an expert research paper analyst.

Please analyze this paper and provide:
- Summary in plain English
- 3 key findings
- Limitations
- How this advances the field

Paper: {text}
```

### For OpenAI (GPT-3.5/4)

- Highly responsive to instruction clarity
- Excel at structured output (JSON)
- Good at reasoning chains
- More expensive but often more accurate

**Best prompt template:**
```
You are analyzing an academic paper.

Please respond with ONLY valid JSON:
{
  "summary": "...",
  "findings": [...],
  "limitations": [...],
  "impact": "..."
}

Paper text:
{text}
```

### For Fallback (Transformers)

- Shorter prompts work better
- Avoid complex instructions
- Works best for summarization
- CPU-friendly

**Best prompt template:**
```
Summarize this paper:
{text}

Key points:
```

---

## 7. Error Handling in Prompts

### Graceful Degradation

```
You are a research assistant. Try to answer the following question about a paper.

Context: {context}
Question: {question}

Guidelines:
1. If you can answer: Provide a clear answer with sources
2. If context is unclear: Explain what's unclear
3. If context doesn't cover it: Say "Not covered in provided text"

Answer:
```

### Fallback Prompt

```
The following text is from a research paper:
{text}

Respond with what you can understand about:
- The main topic
- The approach taken
- Any results mentioned

Use simple language.
```

---

## 8. Real-World Examples

### Example 1: Summarize Deep Learning Paper

```
Analyze this deep learning research paper:

{paper_text}

Provide JSON with:
{
  "summary": "5-sentence overview",
  "key_contributions": [
    "How architecture is novel",
    "Performance improvements achieved",
    "Efficiency gains if any"
  ],
  "methodology": "What model/approach was used",
  "limitations": "What won't work with this method",
  "future_scope": "What should researchers do next"
}
```

**Expected Response:**
```json
{
  "summary": "This paper proposes a hybrid CNN-attention architecture...",
  "key_contributions": [
    "Novel combination of convolution and attention",
    "95% accuracy on medical imaging",
    "40% faster than baseline"
  ],
  "methodology": "Trained hybrid CNN+attention on 50k medical images",
  "limitations": "Limited to 2D images, not tested on 3D data",
  "future_scope": "Extend to 3D volumetric imaging and real-time processing"
}
```

### Example 2: RAG Question

```
Paper context: {retrieved_chunks}

Question: What dataset was used in this research?

Answer only from context. If not mentioned, say "Not specified in provided excerpt."
```

**Expected Response:**
```
The paper uses the ImageNet-Medical subset consisting of 50,000 annotated medical images across CT, MRI, and X-ray modalities.
```

---

## 9. Prompt Optimization Checklist

Before using a prompt:

- [ ] Be specific about what you want
- [ ] Limit context to necessary parts
- [ ] Request structured output (JSON, markdown)
- [ ] Include fallback instructions
- [ ] Ask model to admit when unsure
- [ ] Test with different papers
- [ ] Measure quality of outputs
- [ ] Iterate based on results

---

## 10. Cost Optimization

### Reduce API Costs

**1. Limit Context Size**
```python
# Bad: Send entire paper (10K tokens)
text = full_paper_text  # ~10K tokens = $0.03

# Good: Send relevant excerpt (1K tokens)
text = full_paper_text[:4000]  # ~1K tokens = $0.003
```

**2. Batch Operations**
```python
# Bad: Summarize each paper individually
for paper in papers:
    summarize(paper)  # 20 API calls

# Good: Batch similar requests
summaries = batch_summarize(papers[:10])  # 1-2 API calls
```

**3. Use Caching**
```python
# Cache frequently asked questions
cache = {
    "What is the main finding?": "Answer...",
    "What is the methodology?": "Answer..."
}
```

---

## 11. Quality Metrics

### How to Measure Prompt Quality

1. **Relevance**: Does answer match question?
2. **Accuracy**: Is information from the paper correct?
3. **Completeness**: Does it answer fully?
4. **Clarity**: Is it easy to understand?
5. **Brevity**: Is it concise?

**Scoring Template (1-5):**
- Relevance: ___/5
- Accuracy: ___/5
- Completeness: ___/5
- Clarity: ___/5
- Brevity: ___/5
- **Average**: ___/5

---

## 12. Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Model returns text instead of JSON | No explicit instruction | Add: "Respond ONLY with JSON" |
| Answer is too long | No length constraint | Add: "3 sentences maximum" |
| Hallucinated information | Model not grounded | Add: "Use ONLY provided text" |
| Irrelevant answer | Ambiguous question | Make question more specific |
| Timeout | Too much context | Reduce context to 3000 chars |

---

## 13. Production Best Practices

```python
def safe_summarize(text: str) -> dict:
    """
    Summarize with error handling and validation
    """
    # Validate input
    if not text or len(text) < 100:
        return fallback_summary()
    
    # Truncate if too long
    text = text[:4000]
    
    # Create prompt
    prompt = create_summarization_prompt(text)
    
    try:
        # Try primary API
        response = call_gemini_api(prompt)
        # Validate response is valid JSON
        result = json.loads(response)
        return result
    except Exception as e:
        # Fallback
        return fallback_summarize(text)
```

---

**Last Updated: January 2024**

These prompts have been tested and optimized for best performance with ResearchPilot AI.
