import React from 'react';
import './AboutMe.scss';

export const Index = () => {
  return (
    <div className="about-me">
      <h1>Bài tập ReactJS</h1>
      <section className="about-me__intro">
        <p>Họ tên: Chu Đình Hiển</p>
        <p>MSSV: 20215046</p>
      </section>
      <section className="about-me__details">
        <h2>Skill học được</h2>
        <ul>
          <li>Cách hoạt động: Cilent Sider Rendering</li>
          <li>Chia sẻ giữa các components: Redux</li>
          <li>Call API Map</li>
          <li>Thư viện: Ant Design</li>
        </ul>
      </section>
    </div>
  );
}
