import React, { useState } from 'react';
import axios from 'axios';
import styles from './MakeABlog.module.css';
import logoImage from './logo.png';

const MakeABlog = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateBlog = async () => {
    const messages = [
      {
        role: 'user',
        content: `Create a detailed and SEO-optimized blog post about ${title} with the following keywords: ${tags}. Target audience: tech-savvy individuals. Writing style: Formal.`
      }
    ];

    try {
      setLoading(true);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages,
          temperature: 0.5,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setLoading(false);

      if (response.data.choices && response.data.choices.length > 0) {
        setContent(response.data.choices[0].message.content.trim());
      } else {
        throw new Error('Invalid response from OpenAI API');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to generate blog. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    await generateBlog();
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = title ? `${title}.txt` : 'blog.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className={styles.section}>
      <div className={styles.bloggylogo}>
        <img src={logoImage} alt="Bloggy Weather Logo" />
      </div>
      <h1>Welcome To BloggyWeather.online</h1>
      <h2>Embrace an opportunity to generate a SEO optimized blog below.</h2>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Blog Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title here" className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Keywords:</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Keywords seperated by ," className={styles.input} />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Blog'}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {content && (
          <div>
            <h3>Generated Content:</h3>
            <div className={styles.content}>{content}</div>
            <button onClick={handleDownload} className={styles.button}>Download Blog</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeABlog;
