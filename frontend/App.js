import React, { useState } from 'react';
import jsPDF from 'jspdf';

function App() {
  const [resume, setResume] = useState({
    name: '',
    summary: '',
    education: [''],
    experience: [''],
    skills: ['']
  });
  const [username, setUsername] = useState('');
  const [enhancing, setEnhancing] = useState(null);
  const [enhancingItem, setEnhancingItem] = useState({});

  const onUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const content = {
        name: 'Uploaded Name',
        summary: 'This is a parsed summary...',
        education: ['M.Sc. in Data Science'],
        experience: ['Software Engineer at XYZ'],
        skills: ['Python', 'React']
      };
      setResume(content);
    }
  };

  const enhanceSection = async (section) => {
    setEnhancing(section);
    const content = resume[section];
    const res = await fetch('http://localhost:8000/ai-enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, content })
    });
    const data = await res.json();
    setResume({ ...resume, [section]: data.enhanced });
    setEnhancing(null);
  };

  const enhanceItem = async (section, idx) => {
    setEnhancingItem({ section, idx });
    const item = resume[section][idx];
    const res = await fetch('http://localhost:8000/ai-enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, content: item })
    });
    const data = await res.json();
    const updated = [...resume[section]];
    updated[idx] = data.enhanced;
    setResume({ ...resume, [section]: updated });
    setEnhancingItem({});
  };

  const saveResume = async () => {
    const res = await fetch(`http://localhost:8000/save-resume?user=${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resume)
    });
    const msg = await res.json();
    alert(msg.message || 'Saved!');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Name: ${resume.name}`, 10, 10);
    doc.text(`Summary: ${resume.summary}`, 10, 20);
    doc.text('Education:', 10, 30);
    resume.education.forEach((item, i) => doc.text(`- ${item}`, 15, 40 + i * 10));
    const expStart = 50 + resume.education.length * 10;
    doc.text('Experience:', 10, expStart);
    resume.experience.forEach((item, i) => doc.text(`- ${item}`, 15, expStart + 10 + i * 10));
    const skillStart = expStart + 20 + resume.experience.length * 10;
    doc.text('Skills:', 10, skillStart);
    resume.skills.forEach((item, i) => doc.text(`- ${item}`, 15, skillStart + 10 + i * 10));
    doc.save(`${username}_resume.pdf`);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${username}_resume.json`;
    link.click();
  };

  const updateField = (section, idx, value) => {
    const copy = [...resume[section]];
    copy[idx] = value;
    setResume({ ...resume, [section]: copy });
  };

  const addField = (section) => {
    setResume({ ...resume, [section]: [...resume[section], ''] });
  };

  const removeField = (section, idx) => {
    const copy = [...resume[section]];
    copy.splice(idx, 1);
    setResume({ ...resume, [section]: copy });
  };

  const renderList = (section) => (
    resume[section].map((val, idx) => (
      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', padding: '10px', borderRadius: '6px', width: '100%', background: '#fdfdfd', boxShadow: 'inset 0 1px 3px #ddd' }}>
        <input
          style={{ flex: 1, padding: '10px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', background: '#fff8f0' }}
          value={val}
          onChange={(e) => updateField(section, idx, e.target.value)}
        />
        <button
          onClick={() => enhanceItem(section, idx)}
          style={{ backgroundColor: '#0088cc', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#006fa1'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0088cc'}
        >
          {enhancingItem.section === section && enhancingItem.idx === idx ? 'Enhancing...' : 'Enhance with AI'}
        </button>
        <button
          onClick={() => removeField(section, idx)}
          style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '6px 12px', background: '#fff', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#f8d7da'}
          onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
        >
          &times;
        </button>
      </div>
    ))
  );

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
      <div style={{ border: '2px solid #444', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '760px', background: '#ffffff', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <h1 style={{ textAlign: 'center', color: '#222', margin: '0', paddingBottom: '10px', width: '100%', borderBottom: '1px solid #ccc' }}>Resume Editor</h1>

        
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>Upload Resume</label>
          <input type="file" onChange={onUpload} />
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>Name</label>
          <input value={resume.name} onChange={(e) => setResume({ ...resume, name: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#f0f8ff' }} />
          <button onClick={() => enhanceSection('name')} style={{ backgroundColor: '#0088cc', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>{enhancing === 'name' ? 'Enhancing...' : 'Enhance with AI'}</button>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label>Summary</label>
          <textarea value={resume.summary} onChange={(e) => setResume({ ...resume, summary: e.target.value })} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '100px', background: '#f0f8ff' }} />
          <button onClick={() => enhanceSection('summary')} style={{ backgroundColor: '#0088cc', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>{enhancing === 'summary' ? 'Enhancing...' : 'Enhance with AI'}</button>
        </div>

        <div style={{ width: '100%' }}>
          <label>Education</label>
          {renderList('education')}
          <button onClick={() => addField('education')} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>+ Add</button>
        </div>

        <div style={{ width: '100%' }}>
          <label>Experience</label>
          {renderList('experience')}
          <button onClick={() => addField('experience')} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>+ Add</button>
        </div>

        <div style={{ width: '100%' }}>
          <label>Skills</label>
          {renderList('skills')}
          <button onClick={() => addField('skills')} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>+ Add</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <button onClick={saveResume} style={{ backgroundColor: '#006400', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#004d00'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#006400'}>Save</button>
          <button onClick={exportJSON} style={{ backgroundColor: '#005f73', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#003d4c'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#005f73'}>Download JSON</button>
          <button onClick={exportPDF} style={{ backgroundColor: '#d97706', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b45309'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d97706'}>Download PDF</button>
        </div>
      </div>
    </div>
  );
}

export default App;
