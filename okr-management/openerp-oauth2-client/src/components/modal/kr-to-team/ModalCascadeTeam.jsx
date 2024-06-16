import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Fade, Modal } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import FormItem from "components/form/FormItem";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { errorNoti, successNoti } from "utils/notification";
import * as z from "zod";


dayjs.extend(advancedFormat);
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    minWidth: 400,
    padding: 10,
    width: "100%",
    height: "100vh",
    overflowY: "scroll",
  },
  action: {
    display: "flex",
    justifyContent: "end",
    alignItems: "end",
  },
  error: {
    textAlign: "center",
    color: "red",
    marginTop: theme.spacing(2),
  },
  select: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
}));

const initialFormState = { progress: 0, status: "NOT_STARTED", type: "PERSONAL" };

const ModalCascadeTeam = ({ isOpen, handleClose, id }) => {
  const classes = useStyles();
  const router = useParams();

  const queryClient = useQueryClient();

  const schema = z.object({
    userId: z.number().optional().nullable(),
   
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormState,
  });

  const { data: target } = useQuery({
    queryKey: ["target-kr-detail", id],
    queryFn: async () => {
      const res = await request("GET", `/targets/key-result/${id}`, null, null, null, {});
      return res.data;
    },
    enabled: !!id,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const save = async (values) => {
    let successHandler = () => {
      queryClient.invalidateQueries(["targets-kr-detail"]);
      queryClient.invalidateQueries(["target-detail", router.id]);
      // queryClient.invalidateQueries(["targets-detail",target.targetId]);
      successNoti("Update key result successfully!", 3000);
      //   handleClose()
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("patch", `/targets/key-result/${id}`, successHandler, errorHandlers, values);
  };

  const { data: users } = useQuery({
    queryKey: ["user-option"],
    queryFn: async () => {
      const res = await request("GET", `/user/get-all`, null, null, null, {});
      return res.data;
    },
    enabled: true,
  });

  const userOptions = users?.length
    ? users.map((item) => {
        return { label: item.email, value: item.id };
      })
    : [];

  return (
    <>
      <Modal
        className={classes.modal}
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        // BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(save)}>
              <Card className={classes.card}>
                <CardHeader
                  title={
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                      <div className="font-bold text-xl">{"Key Result Details"}</div>

                      <IconButton aria-label="close" onClick={handleClose}>
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                  }
                />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" justifyContent="center" aria-label="Room">
                        <Controller
                          control={control}
                          name={"userId"}
                          render={({ field }) => (
                            <>
                              <FormItem>
                                <Select
                                  labelId="demo-simple-select"
                                  value={field.value ?? ""}
                                  // readOnly
                                  label="user"
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                  displayEmpty
                                  style={{ padding: "5px 0 0 10px" }}
                                >
                                  {userOptions.map((item) => (
                                    <MenuItem
                                      value={item.value}
                                      key={item.value}
                                      style={{ display: "block", padding: "8px" }}
                                    >
                                      {item.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormItem>
                            </>
                          )}
                        />
                        <div>{errors?.userId?.message}</div>
                      </Box>
                    </CardContent>
                  </Grid>

                  <Grid item xs={8}></Grid>
                </Grid>
                <CardActions className={classes.action}>
                  <Button
                    type="button"
                    variant="contained"
                    color="default"
                    onClick={() => {
                      handleClose();
                    }}
                    style={{ textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary" key={id} style={{ textTransform: "none" }}>
                    Update
                  </Button>
                </CardActions>
              </Card>
            </form>
          </FormProvider>
        </Fade>
      </Modal>
    </>
  );
};

export default ModalCascadeTeam;
