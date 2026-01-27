// type Props = {
//   sent: number;
//   failed: number;
//   percent: number;
// };

// export const SendProgressModal = ({ sent, failed, percent }: Props) => (
//     <div className="modal d-block modal-backdrop bg-body" role="dialog">
//       <div className="modal-dialog modal-lg modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header fw-bold">
//             Sending Emails…
//           </div>

//           <div className="modal-body">
//             <div className="card shadow-sm">
//               <div className="card-header fw-bold bg-body-secondary">
//                 Summary
//               </div>

//               <div className="card-body">
//                 <div className="mb-3 d-flex justify-content-between">
//                   <span className="fw-semibold">Sent</span>
//                   <span className="text-success fw-bold">{sent}</span>
//                 </div>

//                 <div className="mb-3 d-flex justify-content-between">
//                   <span className="fw-semibold">Failed</span>
//                   <span className="text-danger fw-bold">{failed}</span>
//                 </div>

//                 <div>
//                   <div className="fw-semibold mb-1">Success Rate</div>
//                   <div className="progress">
//                     <div
//                       className="progress-bar bg-success"
//                       style={{ width: `${percent}%` }}
//                     >
//                       {percent}%
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
// );



type Props = {
  message?: string;
};

export const SendLoadingModal = ({ message }: Props) => (
  <div className="modal d-block modal-backdrop bg-body" role="dialog">
    <div className="modal-dialog modal-md modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header fw-bold">
          Sending Emails…
        </div>

        <div className="modal-body text-center">
          <div className="my-4">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>

            <p className="fw-semibold mb-1">
              {message ?? "Please wait while we send your emails."}
            </p>

            <p className="text-muted mb-0">
              Do not close or refresh this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
