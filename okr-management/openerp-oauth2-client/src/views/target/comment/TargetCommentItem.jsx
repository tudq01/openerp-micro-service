import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { errorNoti, successNoti } from "utils/notification";
import * as z from "zod";

dayjs.extend(advancedFormat);
const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 400,
    padding: 10,
    width: "100%",
    // height: "100vh",
    overflowY: "scroll",
  },
  action: {
    display: "flex",
    justifyContent: "end",
    alignItems: "end",
  },
}));

const DEBOUNCE_TIMEOUT = 500;
const PAGE_SIZE = 5;

const TargetCommentItem = ({ comment, owner }) => {
  const classes = useStyles();
  const router = useParams();
  const history = useHistory();
  const id = router.id;
  const queryClient = useQueryClient();

  const schema = z.object({
    message: z.string().optional().nullable(),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  useEffect(() => {
    if (comment) {
      methods.setValue("message", comment?.message);
    }
  }, [comment, methods]);

  const save = async (values) => {
    let successHandler = (res) => {
      methods.setValue("message", "");
      setEdit(false);
      queryClient.invalidateQueries(["target-comment"]);
      successNoti("Update comment successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("patch", `/targets/comments/${comment?.id}`, successHandler, errorHandlers, {
      message: methods.getValues("message"),
    });
  };
  const [isEdit, setEdit] = useState(false);

  function deleteComment(deletedId) {
    let successHandler = () => {
      successNoti("Delete successfully");
      queryClient.invalidateQueries(["target-comment"]);
    };
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi "),
    };
    request("DELETE", `/targets/comments/${comment?.id}`, successHandler, errorHandlers, {});
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(save)}>
          <Grid
            container
            direction="row"
            justifyContent={owner === comment?.user?.id ? "space-between" : "flex-end"}
            alignItems="center"
          >
            {/* {owner && <div className="text-red-500">Owner</div>} */}
            <div className="flex flex-col gap-2 w-[55%] border-2 p-2 rounded-sm mb-4">
              <div className="flex flex-row justify-between ">
                <div className="font-bold text-xs text-gray-500">{`${comment?.user?.id}`}</div>
                <div className="flex flex-row gap-2">
                  <div className="font-bold text-xs text-gray-500">{`${dayjs(comment?.createdAt).format(
                    "DD/MM/YYYY"
                  )}`}</div>
                  <IconButton
                    onClick={() => {
                      setEdit((prev) => !prev);
                    }}
                    variant="contained"
                    color="success"
                  >
                    <EditIcon className="text-[16px]" fontSize="small" />
                  </IconButton>
                </div>
              </div>
              <Box display="flex" flexDirection="column" justifyContent="center" aria-label="Room">
                {isEdit ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                      <Controller
                        control={control}
                        name={"message"}
                        render={({ field }) => (
                          <>
                            <TextField
                              {...field}
                              id="name"
                              value={field.value}
                              error={errors?.message ? true : false}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Comment"
                              InputLabelProps={{ shrink: true }}
                            />
                          </>
                        )}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className="h-8"
                        onClick={() => {
                          save();
                        }}
                      >
                        {"Comment"}
                      </Button>
                    </div>
                    <div
                      className="text-gray-500 cursor-pointer"
                      onClick={() => {
                        deleteComment(comment?.id);
                      }}
                    >
                      Delete message
                    </div>
                  </div>
                ) : (
                  <div className="text-lg">{comment?.message}</div>
                )}
              </Box>
            </div>
          </Grid>
        </form>
      </FormProvider>
    </>
  );
};

export default TargetCommentItem;
