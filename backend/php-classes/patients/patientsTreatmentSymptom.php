<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/hospital-management/backend/database/config.database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/hospital-management/backend/constants/constants-static.php';



class PatientsTreatmentSymptom
{

    private $db;
    private $details;
    private $pID;

    function __construct()
    {
        $this->db = new Database();
    }

    function get_Details($medicine_array,$patient_id)
    {
        $this->details = $medicine_array;
        $this->pID=$patient_id;
    }

    function gen_json()
    {
        date_default_timezone_set(TIMEZONE_IN);
        $date = new DateTime();
        $date_now = $date->format("d-m-Y");
        $time_now = $date->format("h:m:s A");
        $this->details['date'] = $date_now;
        $this->details['time'] = $time_now;
        $this->details['ID'] = uniqid($this->pID."_");
        $t = time();
        $final[$t] = $this->details;
        return  json_encode($final);
    }

    function send_meds_to_DB($patient_id)
    {
        $sql = "SELECT * FROM " . PATIENTS_HIS . " WHERE hospital_pID='" . $patient_id . "'";
        $res = $this->db->connect()->query($sql);
        if ($res->num_rows > 0) {
            while ($row = $res->fetch_assoc()) {
                $meds_col = $row['hospital_pMeds'];
            }
            if (empty($meds_col)) {
                $meds_json = $this->gen_json();
                $sql_update = "UPDATE " . PATIENTS_HIS . " SET hospital_pMeds = '" . $meds_json . "' WHERE hospital_pID='" . $patient_id . "' AND hospital_pMeds IS NULL ";
                $res_update = $this->db->connect()->query($sql_update);
                if ($res_update) {
                    return true;
                } else {
                    return false;
                }
            } else {
                $existing_meds_col_json = $meds_col;
                $meds_json = $this->gen_json();

                $existing_meds_col_arr = json_decode($existing_meds_col_json, true);
                $meds_arr = json_decode($meds_json, true);

                $combined = array_merge($meds_arr, $existing_meds_col_arr);

                $combined_json = json_encode($combined);
                // print_r($combined_json);

                $sql_update = "UPDATE " . PATIENTS_HIS . " SET hospital_pMeds = '" . $combined_json . "' WHERE hospital_pID='" . $patient_id . "' AND hospital_pMeds IS NOT NULL ";
                $res_update = $this->db->connect()->query($sql_update);
                if ($res_update) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    function get_Db_cols($patient_id){
        $sql = "SELECT * FROM " . PATIENTS_HIS . " WHERE hospital_pID='" . $patient_id . "'";
        $res = $this->db->connect()->query($sql);
        if ($res->num_rows > 0) {
            return $res;
        }
        else{
            return false;
        }
    }

    function send_sym_to_DB($patient_id)
    {
        $sql = "SELECT * FROM " . PATIENTS_HIS . " WHERE hospital_pID='" . $patient_id . "'";
        $res = $this->db->connect()->query($sql);
        if ($res->num_rows > 0) {
            while ($row = $res->fetch_assoc()) {
                $sym_col = $row['hospital_pSym'];
            }
            if (empty($sym_col)) {
                $sym_json = $this->gen_json();
                $sql_update = "UPDATE " . PATIENTS_HIS . " SET hospital_pSym = '" . $sym_json . "' WHERE hospital_pID='" . $patient_id . "' AND hospital_pSym IS NULL ";
                $res_update = $this->db->connect()->query($sql_update);
                if ($res_update) {
                    return true;
                } else {
                    return false;
                }
            } else {
                $existing_sym_col_json = $sym_col;
                $sym_json = $this->gen_json();

                $existing_sym_col_arr = json_decode($existing_sym_col_json, true);
                $meds_arr = json_decode($sym_json, true);

                $combined = array_merge($meds_arr, $existing_sym_col_arr);

                $combined_json = json_encode($combined);
                // print_r($combined_json);

                $sql_update = "UPDATE " . PATIENTS_HIS . " SET hospital_pSym = '" . $combined_json . "' WHERE hospital_pID='" . $patient_id . "' AND hospital_pSym IS NOT NULL ";
                $res_update = $this->db->connect()->query($sql_update);
                if ($res_update) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    
}
