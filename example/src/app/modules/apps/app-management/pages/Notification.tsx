// import React, { useState } from 'react';
// import { Form } from 'react-bootstrap';
// import { Snackbar, Alert } from '@mui/material';
// import axios from 'axios';
// import BASEURL from '../../../../config/baseurl';
// import { request, gql } from 'graphql-request'


// const createNotification = gql`
// mutation NotificationConfig($input: NotificationInput!){
//   notificationConfig(input: $input){
//     success
//     rule{
//       id
//       ruleType
//       daysBefore
//       enabled
//     }
//   }
// }`

// const Notification = () => {
//     const [ruleType, setRuleType] = useState('');
//     const [daysBefore, setDaysBefore] = useState(15);
//     const [enabled, setEnabled] = useState(true);
//     const [message, setMessage] = useState('');
//     const [success, setSuccess] = useState(false);
//     const [open, setOpen] = useState(false);

//     const ruleTypeOptions = [
//         { value: 'EXPIRY_REMINDER', label: 'Expiry Reminder' },
//         { value: 'PAYMENT_DUE', label: 'Payment Due' },
//         { value: 'COMPLIANCE', label: 'Compliance' },
//         { value: 'PERFORMANCE', label: 'Performance Milestone' },
//         { value: 'AMENDMENT', label: 'Amendment Request' },
//         { value: 'RISK', label: 'Risk Clause Trigger' },
//         { value: 'AUDIT', label: 'Review/Audit Schedule' },
//     ];

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();


//         const variables = {
//             ruleType: ruleType,
//             daysBefore: daysBefore,
//             enabled: enabled
//         }
//         request(`${BASEURL}graphql/`, createNotification, { input: variables }, { Authorization: `Bearer ${localStorage.getItem('Token')}` }).then((response: any) => {
//             console.log(response)
//             const val = Object.keys(response?.notificationConfig?.success)
//             console.log(" create notification val", val)
//             if (val) {
//                 setSuccess(true);
//                 setMessage('Notification rule created successfully!');
//             } else {
//                 setSuccess(false);
//                 setMessage('Failed to create notification rule.');
//             }
//         })
        
//         setOpen(true);
//     };

//     const handleClose = () => setOpen(false);

//     return (
//         <div className="container mt-4">
//             <h4>Create Notification Rule</h4>
//             <form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3">
//                     <Form.Label>Notification Type</Form.Label>
//                     <Form.Select
//                         value={ruleType}
//                         onChange={(e) => setRuleType(e.target.value)}
//                         required
//                     >
//                         <option value="">Select Notification Type</option>
//                         {ruleTypeOptions.map((option) => (
//                             <option key={option.value} value={option.value}>
//                                 {option.label}
//                             </option>
//                         ))}
//                     </Form.Select>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                     <Form.Label>Days Before</Form.Label>
//                     <Form.Control
//                         type="number"
//                         value={daysBefore}
//                         onChange={(e) => setDaysBefore(Number(e.target.value))}
//                         min={1}
//                         required
//                     />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                     <Form.Check
//                         type="checkbox"
//                         label="Enabled"
//                         checked={enabled}
//                         onChange={(e) => setEnabled(e.target.checked)}
//                     />
//                 </Form.Group>

//                 <button type="submit" className="btn btn-primary">Save</button>
//             </form>

//             <Snackbar
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//                 open={open}
//                 autoHideDuration={4000}
//                 onClose={handleClose}
//             >
//                 <Alert onClose={handleClose} severity={success ? 'success' : 'error'} variant="filled">
//                     {message}
//                 </Alert>
//             </Snackbar>
//         </div>
//     );
// };

// export default Notification;

// import React, { useState } from 'react';
// import { Form } from 'react-bootstrap';
// import { Snackbar, Alert } from '@mui/material';
// import { request, gql } from 'graphql-request';
// import BASEURL from '../../../../config/baseurl';

// const createNotification = gql`
// mutation NotificationConfig($input: NotificationInput!) {
//   notificationConfig(input: $input) {
//     success
//     rule {
//       id
//       ruleType
//       daysBefore
//       enabled
//     }
//   }
// }`;

// const Notification = () => {
//   const ruleTypeOptions = [
//     { value: 'EXPIRY_REMINDER', label: 'Expiry Reminder' },
//     { value: 'PAYMENT_DUE', label: 'Payment Due' },
//     { value: 'COMPLIANCE', label: 'Compliance' },
//     { value: 'PERFORMANCE', label: 'Performance Milestone' },
//     { value: 'AMENDMENT', label: 'Amendment Request' },
//     { value: 'RISK', label: 'Risk Clause Trigger' },
//     { value: 'AUDIT', label: 'Review/Audit Schedule' },
//   ];

//   // Initialize state for each rule
//   const [rules, setRules] = useState(() =>
//     ruleTypeOptions.map((rule) => ({
//       ruleType: rule.value,
//       enabled: false,
//       daysBefore: 15,
//     }))
//   );

//   const [message, setMessage] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [open, setOpen] = useState(false);

//   const handleCheckboxChange = (index: number) => {
//     const updated = [...rules];
//     updated[index].enabled = !updated[index].enabled;
//     setRules(updated);
//   };

//   const handleDaysBeforeChange = (index: number, value: number) => {
//     const updated = [...rules];
//     updated[index].daysBefore = value;
//     setRules(updated);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const enabledRules = rules.filter((r) => r.enabled);

//     try {
//       for (const rule of enabledRules) {
//         const variables = {
//           ruleType: rule.ruleType,
//           daysBefore: rule.daysBefore,
//           enabled: true,
//         };

//         const response: any = await request(
//           `${BASEURL}graphql/`,
//           createNotification,
//           { input: variables },
//           {
//             Authorization: `Bearer ${localStorage.getItem('Token')}`,
//           }
//         );

//         if (!response?.notificationConfig?.success) {
//           throw new Error(`Failed to create rule for ${rule.ruleType}`);
//         }
//       }

//       setSuccess(true);
//       setMessage('Notification rules created successfully!');
//     } catch (error) {
//       setSuccess(false);
//       setMessage('Failed to create one or more notification rules.');
//       console.error(error);
//     }

//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   return (
//     <div className="container mt-4">
//       <h4>Create Notification Rules</h4>
//       <form onSubmit={handleSubmit}>
//         {ruleTypeOptions.map((option, index) => (
//           <Form.Group className="mb-3" key={option.value}>
//             <Form.Check
//               type="checkbox"
//               id={`checkbox-${option.value}`}
//               label={option.label}
//               checked={rules[index].enabled}
//               onChange={() => handleCheckboxChange(index)}
//             />
//             {rules[index].enabled && (
//               <Form.Control
//                 type="number"
//                 value={rules[index].daysBefore}
//                 min={1}
//                 className="mt-2"
//                 onChange={(e) =>
//                   handleDaysBeforeChange(index, Number(e.target.value))
//                 }
//                 placeholder="Days before notification"
//               />
//             )}
//           </Form.Group>
//         ))}

//         <button type="submit" className="btn btn-primary">
//           Save Notifications
//         </button>
//       </form>

//       <Snackbar
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//         open={open}
//         autoHideDuration={4000}
//         onClose={handleClose}
//       >
//         <Alert onClose={handleClose} severity={success ? 'success' : 'error'} variant="filled">
//           {message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default Notification;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import React, { useState } from 'react';
// import { Form, Row, Col, Button, Container, Table } from 'react-bootstrap';
// import { Snackbar, Alert } from '@mui/material';
// import { request, gql } from 'graphql-request';
// import BASEURL from '../../../../config/baseurl';

// const createNotification = gql`
// mutation NotificationConfig($input: NotificationInput!){
//   notificationConfig(input: $input){
//     success
//     rule {
//       id
//       ruleType
//       daysBefore
//       enabled
//     }
//   }
// }`;

// const ruleTypeOptions = [
//   { value: 'EXPIRY_REMINDER', label: 'Expiry Reminder' },
//   { value: 'PAYMENT_DUE', label: 'Payment Due' },
//   { value: 'COMPLIANCE', label: 'Compliance' },
//   { value: 'PERFORMANCE', label: 'Performance Milestone' },
//   { value: 'AMENDMENT', label: 'Amendment Request' },
//   { value: 'RISK', label: 'Risk Clause Trigger' },
//   { value: 'AUDIT', label: 'Review/Audit Schedule' },
// ];

// const Notification = () => {
//   const [rules, setRules] = useState(
//     ruleTypeOptions.map(rule => ({
//       ...rule,
//       enabled: false,
//       daysBefore: null
//     }))
//   );
//   const [success, setSuccess] = useState(false);
//   const [message, setMessage] = useState('');
//   const [open, setOpen] = useState(false);

//   const handleChange = (index, key, value) => {
//     const updated = [...rules];
//     updated[index][key] = value;
//     setRules(updated);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const activeRules = rules.filter(r => r.enabled);

//     try {
//       for (const rule of activeRules) {
//         const variables = {
//           ruleType: rule.value,
//           daysBefore: rule.daysBefore,
//           enabled: rule.enabled
//         };

//         await request(
//           `${BASEURL}graphql/`,
//           createNotification,
//           { input: variables },
//           { Authorization: `Bearer ${localStorage.getItem('Token')}` }
//         );
//       }

//       setSuccess(true);
//       setMessage('Notification rules saved successfully!');
//     } catch (err) {
//       setSuccess(false);
//       setMessage('Failed to save notification rules.');
//     }

//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   return (
//     <Container className="mt-4">
//       <h4 className="mb-3">Create Notification Rules</h4>
//       <Form onSubmit={handleSubmit}>
//         <Table bordered hover>
//           <thead>
//             <tr className="text-center">
//               <th>Enable</th>
//               <th>Notification Type</th>
//               <th>Days Before</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rules.map((rule, index) => (
//               <tr key={rule.value} className="align-middle">
//                 <td className="text-center">
//                   <Form.Check
//                     type="checkbox"
//                     checked={rule.enabled}
//                     onChange={(e) =>
//                       handleChange(index, 'enabled', e.target.checked)
//                     }
//                   />
//                 </td>
//                 <td>{rule.label}</td>
//                 <td>
//                   <Form.Control
//                     type="number"
//                     min={1}
//                     disabled={!rule.enabled}
//                     value={rule.daysBefore}
//                     placeholder='Please enter the number of day before the notification to be sent'
//                     onChange={(e) =>
//                       handleChange(index, 'daysBefore', parseInt(e.target.value))

//                     }
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//         <Button variant="primary" type="submit">
//           Save Notifications
//         </Button>
//       </Form>

//       <Snackbar
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//         open={open}
//         autoHideDuration={4000}
//         onClose={handleClose}
//       >
//         <Alert
//           onClose={handleClose}
//           severity={success ? 'success' : 'error'}
//           variant="filled"
//         >
//           {message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default Notification;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Container, Table } from 'react-bootstrap';
import { Snackbar, Alert } from '@mui/material';
import { request, gql } from 'graphql-request';
import BASEURL from '../../../../config/baseurl';

const createNotification = gql`
mutation NotificationConfig($input: NotificationInput!) {
  notificationConfig(input: $input) {
    success
    rule {
      id
      ruleType
      daysBefore
      enabled
      notificationEmail
    }
  }
}
`;

const getNotificationsRule = gql`
{
  getNotificationsRule {
    id
    ruleType
    daysBefore
    enabled
    notificationEmail
  }
}
`;

const ruleTypeOptions = [
  { value: 'EXPIRY_REMINDER', label: 'Expiry Reminder' },
  { value: 'PAYMENT_DUE', label: 'Payment Due' },
  { value: 'COMPLIANCE', label: 'Compliance' },
  { value: 'PERFORMANCE', label: 'Performance Milestone' },
  { value: 'AMENDMENT', label: 'Amendment Request' },
  { value: 'RISK', label: 'Risk Clause Trigger' },
  { value: 'AUDIT', label: 'Review/Audit Schedule' },
];

const Notification = () => {
  const [rules, setRules] = useState(
    ruleTypeOptions.map(rule => ({
      ...rule,
      enabled: false,
      daysBefore: '',
      notificationEmail: '',
    }))
  );
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  // 🟡 Load rules from API
  useEffect(() => {
    request(
      `${BASEURL}graphql/`,
      getNotificationsRule,
      {},
      { Authorization: `Bearer ${localStorage.getItem('Token')}` }
    )
      .then((res) => {
        const apiRules = res.getNotificationsRule;

        // Merge existing config into rules
        const updatedRules = ruleTypeOptions.map((rule) => {
          const existing = apiRules.find(r => r.ruleType === rule.value);
          return {
            ...rule,
            enabled: !!existing,
            daysBefore: existing?.daysBefore || '',
            notificationEmail: existing?.notificationEmail || '',
          };
        });

        setRules(updatedRules);
      })
      .catch((err) => {
        console.error('Error fetching notification rules:', err);
      });
  }, []);

  const handleChange = (index, key, value) => {
    const updated = [...rules];
    updated[index][key] = value;
    setRules(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const activeRules = rules.filter(rule => rule.enabled);

    try {
      for (const rule of activeRules) {
        const variables = {
          ruleType: rule.value,
          daysBefore: rule.daysBefore,
          enabled: rule.enabled,
          notificationEmail: rule.notificationEmail || null,
        };

        await request(
          `${BASEURL}graphql/`,
          createNotification,
          { input: variables },
          { Authorization: `Bearer ${localStorage.getItem('Token')}` }
        );
      }

      setSuccess(true);
      setMessage('Notification rules saved successfully!');
    } catch (err) {
      setSuccess(false);
      setMessage('Failed to save notification rules.');
    }

    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Container className="mt-4">
      <h4 className="mb-3">Create Notification Rules</h4>
      <Form onSubmit={handleSubmit}>
        <Table bordered hover>
          <thead>
            <tr className="text-center">
              <th>Enable</th>
              <th>Notification Type</th>
              <th>Days Before</th>
              <th>Notification Email</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, index) => (
              <tr key={rule.value} className="align-middle">
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(e) =>
                      handleChange(index, 'enabled', e.target.checked)
                    }
                  />
                </td>
                <td>{rule.label}</td>
                <td>
                  <Form.Control
                    type="number"
                    min={1}
                    disabled={!rule.enabled}
                    value={rule.daysBefore}
                    placeholder="Days before"
                    onChange={(e) =>
                      handleChange(index, 'daysBefore', parseInt(e.target.value) || '')
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="email"
                    disabled={!rule.enabled}
                    value={rule.notificationEmail}
                    placeholder="Enter notification email"
                    onChange={(e) =>
                      handleChange(index, 'notificationEmail', e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" type="submit">
          Save Notifications
        </Button>
      </Form>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={success ? 'success' : 'error'}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Notification;
