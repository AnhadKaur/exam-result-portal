export const exportToCSV = (results, fileName = 'results.csv') => {
  if (!results || results.length === 0) {
    alert('No results to export');
    return;
  }

  const headers = ['Subject', 'Exam Type', 'Marks', 'Grade', 'Status', 'Semester No'];

  // Map results to CSV rows
  const rows = results.map(r => [
    r.subject.name,
    r.exam.examType,
    r.marks.toFixed(2),
    r.grade,
    r.status.toUpperCase(),
    r.exam.semester.semesterNo
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        if (typeof cell === 'string' && cell.includes(',')) {
          return `"${cell}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');

  downloadCSV(csvContent, fileName);
};

export const exportStudentResultsToCSV = (results, fileName = 'student_results.csv') => {
  if (!results || results.length === 0) {
    alert('No results to export');
    return;
  }

  const headers = ['Student Email', 'Roll Number', 'Subject', 'Exam Type', 'Marks', 'Grade', 'Status'];

  const rows = results.map(r => [
    r.student.user.email,
    r.student.rollNumber,
    r.subject.name,
    r.exam.examType,
    r.marks.toFixed(2),
    r.grade,
    r.status.toUpperCase()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadCSV(csvContent, fileName);
};

const downloadCSV = (csvContent, fileName) => {
  const element = document.createElement('a');
  const file = new Blob([csvContent], { type: 'text/csv' });
  
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  element.click();
  
  URL.revokeObjectURL(element.href);
};

export const CaptchaComponent = ({ onVerify, theme = 'light' }) => {
  return (
    <div style={{
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      marginBottom: '15px',
      backgroundColor: theme === 'light' ? '#f9f9f9' : '#333'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
            I'm not a robot
          </p>
        </div>
        <div style={{
          fontSize: '12px',
          color: '#666',
          textAlign: 'right'
        }}>
          <p style={{ margin: 0 }}>reCAPTCHA</p>
          <a href="#" style={{ color: '#0066cc', textDecoration: 'none' }}>
            Privacy
          </a>
          {' - '}
          <a href="#" style={{ color: '#0066cc', textDecoration: 'none' }}>
            Terms
          </a>
        </div>
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
        Ready for reCAPTCHA v2/v3 integration
      </div>
    </div>
  );
};

export default {
  exportToCSV,
  exportStudentResultsToCSV,
  CaptchaComponent
};
