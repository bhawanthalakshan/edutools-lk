import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUniversity, FaGraduationCap, FaBook, FaArrowRight, FaFilePdf, FaCalendarAlt } from 'react-icons/fa';
import Seo from '../../components/Seo';
import Breadcrumbs from '../../components/Breadcrumbs';
import AdPlaceholder from '../../components/AdPlaceholder';
import PastPaperCard from '../../components/PastPaperCard';
import { 
  getUniversityBySlug, 
  getCourses, 
  getModules, 
  getPastPapers 
} from '../../services/pastPaperService';

const UniversityDetailPage = () => {
  const { uniSlug, courseSlug, moduleSlug } = useParams();

  const [university, setUniversity] = useState(null);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (uniSlug && !courseSlug) {
      // Step 1: Viewing University -> Load Courses
      getUniversityBySlug(uniSlug)
        .then((res) => {
          setUniversity(res.data);
          return getCourses({ universitySlug: uniSlug });
        })
        .then((res) => {
          setCourses(res.data || []);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));

    } else if (uniSlug && courseSlug && !moduleSlug) {
      // Step 2: Viewing Course -> Load Modules
      Promise.all([
        getUniversityBySlug(uniSlug).catch(() => null),
        getCourses({ universitySlug: uniSlug }).catch(() => ({ data: [] })),
        getModules({ courseSlug }).catch(() => ({ data: [] })),
      ]).then(([uniRes, courseRes, moduleRes]) => {
        if (uniRes?.data) setUniversity(uniRes.data);
        if (moduleRes?.data) setModules(moduleRes.data || []);
      }).finally(() => setLoading(false));

    } else if (uniSlug && courseSlug && moduleSlug) {
      // Step 3: Viewing Module -> Load Papers
      Promise.all([
        getUniversityBySlug(uniSlug).catch(() => null),
        getPastPapers({
          examType: 'UNIVERSITY',
          universitySlug: uniSlug,
          courseSlug,
          moduleSlug,
          limit: 50,
          sort: '-year',
        }).catch(() => ({ data: [] })),
      ]).then(([uniRes, paperRes]) => {
        if (uniRes?.data) setUniversity(uniRes.data);
        if (paperRes?.data) setPapers(paperRes.data || []);
      }).finally(() => setLoading(false));
    }
  }, [uniSlug, courseSlug, moduleSlug]);

  const uniName = university ? university.name : uniSlug.toUpperCase();
  const courseName = courseSlug ? courseSlug.replace(/-/g, ' ').toUpperCase() : '';
  const moduleName = moduleSlug ? moduleSlug.replace(/-/g, ' ').toUpperCase() : '';

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: 'Past Papers', url: '/past-papers' },
    { label: 'University Papers', url: '/past-papers/university' },
  ];

  if (uniSlug) {
    breadcrumbItems.push({
      label: uniName,
      url: courseSlug ? `/past-papers/university/${uniSlug}` : undefined,
    });
  }
  if (courseSlug) {
    breadcrumbItems.push({
      label: courseName,
      url: moduleSlug ? `/past-papers/university/${uniSlug}/${courseSlug}` : undefined,
    });
  }
  if (moduleSlug) {
    breadcrumbItems.push({ label: moduleName });
  }

  // Group papers by Year if viewing module papers
  const groupedPapers = papers.reduce((groups, paper) => {
    const y = paper.year || 'Other';
    if (!groups[y]) groups[y] = [];
    groups[y].push(paper);
    return groups;
  }, {});
  const yearsDescending = Object.keys(groupedPapers).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <Seo
        title={`${uniName} ${moduleName || courseName || 'Degree'} Past Papers`}
        description={`Browse and download ${uniName} undergraduate degree past papers, module exam questions, and revision guides.`}
      />

      <Breadcrumbs items={breadcrumbItems} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-8 sm:p-10 rounded-3xl text-white shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <FaUniversity className="text-purple-400 text-xl" />
          <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
            {uniName}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          {moduleName ? `${moduleName} Past Papers` : courseName ? `${courseName} Modules` : `${uniName} Degree Courses`}
        </h1>
        <p className="text-xs sm:text-sm text-purple-100/90 max-w-3xl">
          Browse official past examination papers and module resources for {uniName}.
        </p>
      </div>

      <AdPlaceholder type="banner" />

      {/* STEP 1: COURSES LIST (If viewing University) */}
      {uniSlug && !courseSlug && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FaGraduationCap className="text-purple-600" />
            <span>Select Degree / Course</span>
          </h2>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
              Loading degree courses...
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">{course.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {course.description || `Browse course modules and past papers for ${course.name}.`}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-600">{course.moduleCount || 0} Modules</span>
                    <Link
                      to={`/past-papers/university/${uniSlug}/${course.slug}`}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Modules</span>
                      <FaArrowRight className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              No courses registered under {uniName} yet.
            </div>
          )}
        </div>
      )}

      {/* STEP 2: MODULES LIST (If viewing Course) */}
      {uniSlug && courseSlug && !moduleSlug && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FaBook className="text-purple-600" />
            <span>Select Subject / Module</span>
          </h2>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
              Loading course modules...
            </div>
          ) : modules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((mod) => (
                <div
                  key={mod._id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {mod.code && (
                      <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                        {mod.code}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900">{mod.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {mod.description || `Browse past papers for ${mod.name}.`}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-600">{mod.paperCount || 0} Papers</span>
                    <Link
                      to={`/past-papers/university/${uniSlug}/${courseSlug}/${mod.slug}`}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Papers</span>
                      <FaArrowRight className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
              No modules listed for this course yet.
            </div>
          )}
        </div>
      )}

      {/* STEP 3: PAPERS LIST (If viewing Module) */}
      {uniSlug && courseSlug && moduleSlug && (
        <div className="space-y-8">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
              Loading module past papers...
            </div>
          ) : yearsDescending.length > 0 ? (
            yearsDescending.map((yr) => (
              <div key={yr} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                    <FaCalendarAlt className="text-sm" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    {yr} {moduleName} Past Papers
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedPapers[yr].map((paper) => (
                    <PastPaperCard key={paper._id} paper={paper} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
              <div className="p-4 bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400 text-2xl">
                <FaFilePdf />
              </div>
              <h2 className="text-xl font-bold text-slate-800">No past papers found for this module</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Check back soon or explore other university degree modules.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversityDetailPage;
