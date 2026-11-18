import { CareerCategory } from "../types/profile";

export interface RoleBlueprint {
  title: string;
  category: CareerCategory;
  primarySkills: string[];
  secondarySkills: string[];
  focusAreas: string[];
  responsibilityKeywords: string[];
}

export const ROLE_BLUEPRINTS: Record<CareerCategory, RoleBlueprint> = {
  data_analyst: {
    title: "Data Analyst",
    category: "data_analyst",
    primarySkills: ["SQL", "Power BI", "DAX", "Tableau", "Python", "Pandas", "ETL", "Excel"],
    secondarySkills: ["Data Warehousing", "Statistical Modeling", "Power Query", "PostgreSQL"],
    focusAreas: [
      "SQL and relational database management",
      "Executive KPI reporting & dashboard development",
      "Python data cleaning, transformation & Pandas workflows",
      "Data ingestion, automated ETL pipelines & star-schema modeling",
      "Business intelligence & commercial variance analysis",
    ],
    responsibilityKeywords: [
      "Engineered automated ETL pipelines",
      "Developed executive Power BI dashboards with DAX modeling",
      "Formulated complex SQL queries and stored procedures",
      "Analyzed commercial KPIs and stakeholder reporting",
    ],
  },
  data_scientist: {
    title: "Data Scientist",
    category: "data_scientist",
    primarySkills: ["Python", "Machine Learning", "Scikit-Learn", "Statistics", "Pandas", "NumPy", "SQL"],
    secondarySkills: ["XGBoost", "Feature Engineering", "SHAP", "Hypothesis Testing", "Data Mining"],
    focusAreas: [
      "Statistical modeling and probabilistic inference",
      "Supervised & unsupervised machine learning pipelines",
      "Feature engineering, categorical encoding & SMOTE resampling",
      "Model evaluation metrics (ROC-AUC, F1-Score, RMSE)",
      "Applied predictive analytics for customer & commercial behavior",
    ],
    responsibilityKeywords: [
      "Trained and evaluated predictive machine learning models",
      "Conducted exploratory data analysis and statistical validation",
      "Engineered interaction features improving classification accuracy",
      "Interpreted model inference using SHAP feature attributions",
    ],
  },
  ai_ml_engineer: {
    title: "AI / Machine Learning Engineer",
    category: "ai_ml_engineer",
    primarySkills: ["Python", "PyTorch", "Machine Learning", "Deep Learning", "REST API", "Docker", "Cloud"],
    secondarySkills: ["Scikit-Learn", "FastAPI", "Model Deployment", "Inference Optimization", "Git"],
    focusAreas: [
      "Deep learning frameworks (PyTorch, Neural Networks)",
      "Production model deployment and RESTful API integration",
      "Containerized microservices using Docker",
      "Inference latency reduction and pipeline scalability",
      "Model monitoring, data drift and reproducible experiments",
    ],
    responsibilityKeywords: [
      "Implemented and benchmarked deep neural network architectures",
      "Deployed scalable model inference microservices via containerized APIs",
      "Integrated automated retraining pipelines with reproducible logging",
      "Optimized model inference latency and memory footprints",
    ],
  },
  software_engineer: {
    title: "Software Engineer / Full-Stack Developer",
    category: "software_engineer",
    primarySkills: ["C#", ".NET Core", "ASP.NET Core", "Angular", "TypeScript", "SQL Server", "REST API"],
    secondarySkills: ["Entity Framework", "Microservices", "JavaScript", "Docker", "Git", "Agile"],
    focusAreas: [
      "Backend microservices and clean architecture in C# .NET",
      "Enterprise RESTful APIs with ASP.NET Core Web API",
      "Frontend single-page applications with Angular & TypeScript",
      "Relational database design, indexing, and query tuning in SQL Server",
      "Domain-Driven Design (DDD), CI/CD, and automated unit testing",
    ],
    responsibilityKeywords: [
      "Architected and deployed scalable RESTful APIs in C# ASP.NET Core",
      "Developed modular single-page frontend applications in Angular and TypeScript",
      "Designed relational database schemas and optimized SQL Server queries",
      "Maintained 90%+ automated test coverage adhering to clean code standards",
    ],
  },
};
