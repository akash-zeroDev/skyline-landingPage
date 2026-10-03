import React from 'react';

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  return (
    <li
      className="project-card-item"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Whole card is one accessible link. TODO: link to /work/${project.slug} when case study page is built */}
      <a
        href={`#${project.slug}`}
        className="project-card-link"
        aria-label={`View ${project.title} case study: ${project.description}`}
      >
        <article className="project-card-article">
          {/* Media container with 4:3 aspect ratio and rounded corners */}
          <div className="project-image-wrapper">
            <img
              src={project.image}
              alt={project.imageAlt}
              className="project-image"
              loading="lazy"
              width={1200}
              height={900}
            />

            {/* "View case study →" badge: fades/slides in on desktop hover, always visible on mobile/touch */}
            <div className="case-study-badge" aria-hidden="true">
              <span>View case study</span>
              <span className="badge-arrow">→</span>
            </div>
          </div>

          {/* Card metadata */}
          <div className="project-card-info">
            <div className="project-card-header">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
            </div>

            {/* Pill tags matching the navbar visual language */}
            <ul className="project-tags-list" aria-label="Project tags">
              {project.tags.map((tag) => (
                <li key={tag} className="project-tag-pill">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </a>
    </li>
  );
};

export default ProjectCard;
